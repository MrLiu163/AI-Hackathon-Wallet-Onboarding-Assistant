export interface EvmTransaction {
  hash: string
  blockNumber: string
  timeStamp: string
  from: string
  to: string
  value: string
  contractAddress: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  gas: string
  gasPrice: string
  gasUsed: string
  isError: string
  chainName?: string
}

export interface TronTransaction {
  hash: string
  block: number
  timestamp: number
  ownerAddress: string
  toAddress: string
  contractType: number
  confirmed: boolean
  contractData?: {
    amount?: number
    asset_name?: string
    owner_address?: string
    to_address?: string
  }
  cost?: {
    net_fee?: number
    energy_fee?: number
    energy_usage_total?: number
  }
}

export interface ExportOptions {
  period: "1week" | "1month" | "3months"
}

// Get timestamp for period
function getTimestampForPeriod(period: ExportOptions["period"]): number {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  switch (period) {
    case "1week":
      return now - 7 * day
    case "1month":
      return now - 30 * day
    case "3months":
      return now - 90 * day
  }
}

// Fetch EVM transaction history from DeBank
export async function fetchEvmTransactionHistory(
  address: string,
  options: ExportOptions,
  apiKey?: string,
): Promise<EvmTransaction[]> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["AccessKey"] = apiKey
    }

    console.log("[v0] Fetching EVM transaction history for:", address)

    const response = await fetch(`https://pro-openapi.debank.com/v1/user/all_history_list?id=${address}`, {
      headers,
    })

    if (!response.ok) {
      console.error("[v0] DeBank history API error:", response.status)
      return []
    }

    const data = await response.json()
    console.log("[v0] DeBank history response:", data?.history_list?.length || 0, "transactions")

    const startTimestamp = getTimestampForPeriod(options.period) / 1000 // Convert to seconds

    // Filter by period and map to our format
    const transactions: EvmTransaction[] = (data.history_list || [])
      .filter((tx: any) => tx.time_at >= startTimestamp)
      .map((tx: any) => ({
        hash: tx.id || "",
        blockNumber: "",
        timeStamp: String(tx.time_at || 0),
        from: tx.other_addr || "",
        to: tx.other_addr || "",
        value: String(tx.sends?.[0]?.amount || 0),
        contractAddress: tx.sends?.[0]?.token_id || "",
        tokenName: tx.sends?.[0]?.name || "",
        tokenSymbol: tx.sends?.[0]?.symbol || "",
        tokenDecimal: String(tx.sends?.[0]?.decimals || 18),
        gas: "",
        gasPrice: "",
        gasUsed: "",
        isError: "0",
        chainName: tx.chain || "",
      }))

    return transactions
  } catch (error) {
    console.error("[v0] Fetch EVM history error:", error)
    return []
  }
}

// Fetch TRON transaction history from Tronscan
export async function fetchTronTransactionHistory(
  address: string,
  options: ExportOptions,
  apiKey?: string,
): Promise<TronTransaction[]> {
  try {
    const startTimestamp = getTimestampForPeriod(options.period)
    const endTimestamp = Date.now()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["TRON-PRO-API-KEY"] = apiKey
    }

    console.log("[v0] Fetching TRON transaction history for:", address)

    const response = await fetch(
      `https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=50&start=0&address=${address}&start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}`,
      {
        headers,
      },
    )

    if (!response.ok) {
      console.error("[v0] Tronscan API error:", response.status)
      return []
    }

    const data = await response.json()
    console.log("[v0] Tronscan response:", data?.data?.length || 0, "transactions")

    return data.data || []
  } catch (error) {
    console.error("[v0] Fetch TRON history error:", error)
    return []
  }
}

// Convert transactions to CSV format
export function convertToCSV(
  evmTransactions: EvmTransaction[],
  tronTransactions: TronTransaction[],
  locale = "en",
): string {
  const isZh = locale === "zh"

  // CSV Headers
  const headers = isZh
    ? ["网络", "交易哈希", "时间", "发送方", "接收方", "金额", "代币名称", "代币符号", "Gas费用", "状态"]
    : ["Network", "Transaction Hash", "Time", "From", "To", "Amount", "Token Name", "Token Symbol", "Gas Fee", "Status"]

  let csv = headers.join(",") + "\n"

  // Add EVM transactions
  evmTransactions.forEach((tx) => {
    const time = new Date(Number(tx.timeStamp) * 1000).toLocaleString()
    const amount = (Number(tx.value) / Math.pow(10, Number(tx.tokenDecimal) || 18)).toFixed(6)
    const gasFee = tx.gasUsed && tx.gasPrice ? (Number(tx.gasUsed) * Number(tx.gasPrice)) / 1e18 : 0

    csv += [
      tx.chainName || "EVM",
      tx.hash,
      time,
      tx.from,
      tx.to,
      amount,
      tx.tokenName || "ETH",
      tx.tokenSymbol || "ETH",
      gasFee.toFixed(6),
      tx.isError === "0" ? (isZh ? "成功" : "Success") : isZh ? "失败" : "Failed",
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    csv += "\n"
  })

  // Add TRON transactions
  tronTransactions.forEach((tx) => {
    const time = new Date(tx.timestamp).toLocaleString()
    const amount = (tx.contractData?.amount || 0) / 1e6 // TRX has 6 decimals
    const gasFee = ((tx.cost?.net_fee || 0) + (tx.cost?.energy_fee || 0)) / 1e6

    csv += [
      "TRON",
      tx.hash,
      time,
      tx.ownerAddress || tx.contractData?.owner_address || "",
      tx.toAddress || tx.contractData?.to_address || "",
      amount.toFixed(6),
      tx.contractData?.asset_name || "TRX",
      tx.contractData?.asset_name || "TRX",
      gasFee.toFixed(6),
      tx.confirmed ? (isZh ? "成功" : "Success") : isZh ? "待确认" : "Pending",
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    csv += "\n"
  })

  return csv
}
