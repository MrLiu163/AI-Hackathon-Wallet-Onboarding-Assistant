export interface TokenBalance {
  id: string
  chain: string
  name: string
  symbol: string
  amount: number
  price: number
  value: number
}

export interface TotalBalanceResponse {
  total_usd_value: number
  chain_list: Array<{
    id: string
    community_id: number
    name: string
    native_token_id: string
    logo_url: string
    wrapped_token_id: string
    usd_value: number
  }>
}

export interface TokenListItem {
  id: string
  chain: string
  name: string
  symbol: string
  display_symbol: string | null
  optimized_symbol: string
  decimals: number
  logo_url: string
  protocol_id: string
  price: number
  price_24h_change: number
  is_verified: boolean
  is_core: boolean
  is_wallet: boolean
  time_at: number
  amount: number
  raw_amount: number
  raw_amount_hex_str: string
}

export interface PortfolioData {
  totalUsdValue: number
  chainList: Array<{
    id: string
    name: string
    usdValue: number
  }>
  tokens: TokenBalance[]
}

export async function getPortfolio(address: string, apiKey?: string): Promise<PortfolioData | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["AccessKey"] = apiKey
    }

    console.log("[v0] Fetching DeBank data for address:", address)

    // First API: Get total balance
    const balanceResponse = await fetch(`https://pro-openapi.debank.com/v1/user/total_balance?id=${address}`, {
      headers,
    })

    if (!balanceResponse.ok) {
      console.error("[v0] DeBank total_balance API error:", balanceResponse.status)
      throw new Error(`Failed to fetch balance: ${balanceResponse.status}`)
    }

    const balanceData: TotalBalanceResponse = await balanceResponse.json()
    console.log("[v0] DeBank total balance:", balanceData.total_usd_value)
    console.log("[v0] DeBank chains:", balanceData.chain_list?.length || 0)

    // Second API: Get all token list (changed from token_list to all_token_list)
    const tokensResponse = await fetch(
      `https://pro-openapi.debank.com/v1/user/all_token_list?id=${address}&is_all=false`,
      {
        headers,
      },
    )

    let tokensData: TokenListItem[] = []
    if (tokensResponse.ok) {
      tokensData = await tokensResponse.json()
      console.log("[v0] DeBank tokens count:", tokensData.length)
    } else {
      console.error("[v0] DeBank all_token_list API error:", tokensResponse.status)
    }

    return {
      totalUsdValue: balanceData.total_usd_value || 0,
      chainList: (balanceData.chain_list || []).map((chain) => ({
        id: chain.id,
        name: chain.name,
        usdValue: chain.usd_value,
      })),
      tokens: tokensData.map((token) => ({
        id: token.id,
        chain: token.chain,
        name: token.name,
        symbol: token.symbol,
        amount: token.amount,
        price: token.price,
        value: token.amount * token.price,
      })),
    }
  } catch (error) {
    console.error("[v0] DeBank API error:", error)
    return null
  }
}
