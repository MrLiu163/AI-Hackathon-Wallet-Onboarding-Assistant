export interface ChainbaseTransaction {
  transaction_hash: string
  block_number: string
  from_address: string
  to_address: string
  value: string
  gas: string
  gas_price: string
  input: string
  nonce: string
  transaction_index: string
  block_timestamp: string
}

export interface ChainbaseDetectResult {
  found: boolean
  chainId?: string
  chainName?: string
  transaction?: ChainbaseTransaction
}

// Chainbase supported chains
const CHAINBASE_SUPPORTED_CHAINS = [
  { chainId: 1, chainName: "Ethereum" },
  { chainId: 137, chainName: "Polygon" },
  { chainId: 56, chainName: "BSC" },
  { chainId: 43114, chainName: "Avalanche" },
  { chainId: 42161, chainName: "Arbitrum One" },
  { chainId: 10, chainName: "Optimism" },
  { chainId: 8453, chainName: "Base" },
  { chainId: 324, chainName: "zkSync" },
  { chainId: 4200, chainName: "Merlin" },
]

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get transaction details from Chainbase API
 */
async function chainbaseGetTx(
  chainId: number,
  txHash: string,
  apiKey: string,
): Promise<{ valid: boolean; tx?: ChainbaseTransaction }> {
  const url = `https://api.chainbase.online/v1/tx/detail?chain_id=${chainId}&hash=${txHash}`

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    })

    if (!response.ok) {
      return { valid: false }
    }

    const data = await response.json()

    // Check if response contains valid transaction data
    if (data?.data) {
      const tx = data.data

      // Validate transaction: hash matches, has block_number (confirmed), and has from_address
      if (
        tx.transaction_hash &&
        tx.transaction_hash.toLowerCase() === txHash.toLowerCase() &&
        tx.block_number &&
        tx.from_address
      ) {
        return { valid: true, tx }
      }
    }

    return { valid: false }
  } catch (error) {
    console.error(`[v0] Chainbase API error for chain ${chainId}:`, error)
    return { valid: false }
  }
}

/**
 * Detect which chain a transaction belongs to using Chainbase API
 * Rate limited to 200ms between requests
 */
export async function detectChainWithChainbase(txHash: string, apiKey: string): Promise<ChainbaseDetectResult> {
  console.log("[v0] Starting Chainbase chain detection")

  for (const { chainId, chainName } of CHAINBASE_SUPPORTED_CHAINS) {
    console.log(`[v0] Checking Chainbase chain ${chainName} (${chainId})`)

    const { valid, tx } = await chainbaseGetTx(chainId, txHash, apiKey)

    if (valid && tx) {
      console.log(`[v0] Transaction found on ${chainName} via Chainbase!`)
      return {
        found: true,
        chainId: String(chainId),
        chainName,
        transaction: tx,
      }
    }

    // Rate limit: 200ms between requests
    await sleep(200)
  }

  console.log("[v0] Transaction not found on any Chainbase-supported chain")
  return { found: false }
}
