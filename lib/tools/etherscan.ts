import { PRIORITY_CHAIN_IDS } from "../chains/registry"
import { detectChainWithChainbase } from "./chainbase"

export interface EtherscanChain {
  chainid: string
  chainname: string
  status: string
  apiurl: string
  blockexplorer: string
}

export interface DetectChainResult {
  found: boolean
  chainId?: string
  chainName?: string
  explorerTxUrl?: string
  transaction?: any
  source?: "chainbase" | "etherscan"
}

/**
 * Fetch list of all chains supported by Etherscan v2 API
 */
async function etherscanChainlist(): Promise<EtherscanChain[]> {
  const url = "https://api.etherscan.io/v2/chainlist"
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Chainlist API error: ${response.status}`)
  }

  const data = await response.json()
  // Filter only online chains (status === "1")
  return (data.result || []).filter((chain: EtherscanChain) => String(chain.status) === "1")
}

/**
 * Check if a transaction is valid based on Etherscan response
 */
function isValidTransaction(result: any, expectedHash: string): boolean {
  // Must be an object
  if (!result || typeof result !== "object") return false

  // Must not have error
  if (result.error || result.message) return false

  // Hash must match
  if (!result.hash || result.hash.toLowerCase() !== expectedHash.toLowerCase()) return false

  // Must have blockNumber (confirmed transaction)
  if (!result.blockNumber) return false

  // Must have from address
  if (!result.from) return false

  return true
}

/**
 * Check if a transaction exists on a specific chain
 */
async function etherscanGetTxOnChain(
  chainid: string,
  txhash: string,
  apikey?: string,
): Promise<{ valid: boolean; tx?: any }> {
  const url = new URL("https://api.etherscan.io/v2/api")
  url.searchParams.set("chainid", chainid)
  url.searchParams.set("module", "proxy")
  url.searchParams.set("action", "eth_getTransactionByHash")
  url.searchParams.set("txhash", txhash)

  if (apikey) {
    url.searchParams.set("apikey", apikey)
  }

  try {
    const response = await fetch(url.toString())
    if (!response.ok) return { valid: false }

    const data = await response.json()
    const result = data?.result

    if (result && isValidTransaction(result, txhash)) {
      return { valid: true, tx: result }
    }

    return { valid: false }
  } catch (error) {
    console.error(`[v0] Error checking chain ${chainid}:`, error)
    return { valid: false }
  }
}

/**
 * Detect which chain a transaction belongs to
 * Strategy: Try Etherscan first (priority), fall back to Chainbase
 * Rate limited to 3 requests per second for Etherscan
 */
export async function detectChainFromTxHash(
  txHash: string,
  etherscanApiKey?: string,
  chainbaseApiKey?: string,
): Promise<DetectChainResult> {
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    console.log("[v0] Invalid transaction hash format")
    return { found: false }
  }

  if (etherscanApiKey) {
    console.log("[v0] Trying Etherscan API first")

    try {
      console.log("[v0] Fetching chainlist from Etherscan v2 API")
      const allChains = await etherscanChainlist()

      const chains = allChains.filter((chain) => PRIORITY_CHAIN_IDS.includes(Number(chain.chainid)))

      console.log(`[v0] Found ${chains.length} priority chains to check from ${allChains.length} total`)

      const RATE_LIMIT_DELAY = 300 // 300ms = ~3 requests per second

      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i]

        console.log(`[v0] Checking chain ${chain.chainname} (${chain.chainid})`)
        const { valid, tx } = await etherscanGetTxOnChain(chain.chainid, txHash, etherscanApiKey)

        if (valid && tx) {
          console.log(`[v0] Transaction found on chain ${chain.chainname} via Etherscan!`)
          return {
            found: true,
            chainId: chain.chainid,
            chainName: chain.chainname,
            explorerTxUrl: `${chain.blockexplorer}/tx/${txHash}`,
            transaction: tx,
            source: "etherscan",
          }
        }

        // Rate limit between requests
        if (i < chains.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY))
        }
      }

      console.log("[v0] Transaction not found on any Etherscan chain")
    } catch (error) {
      console.error("[v0] Etherscan API error:", error)
    }
  } else {
    console.log("[v0] Skipping Etherscan (no API key)")
  }

  if (chainbaseApiKey) {
    console.log("[v0] Falling back to Chainbase API")

    const chainbaseResult = await detectChainWithChainbase(txHash, chainbaseApiKey)

    if (chainbaseResult.found) {
      // Need to get explorer URL from our chain registry
      const { getChainById } = await import("../chains/registry")
      const chainConfig = getChainById(Number(chainbaseResult.chainId))

      return {
        found: true,
        chainId: chainbaseResult.chainId,
        chainName: chainbaseResult.chainName,
        explorerTxUrl: chainConfig
          ? `${chainConfig.blockExplorerUrls[0]}/tx/${txHash}`
          : `https://etherscan.io/tx/${txHash}`,
        transaction: chainbaseResult.transaction,
        source: "chainbase",
      }
    }
  } else {
    console.log("[v0] Skipping Chainbase (no API key)")
  }

  console.log("[v0] Transaction not found on any supported chain")
  return { found: false }
}
