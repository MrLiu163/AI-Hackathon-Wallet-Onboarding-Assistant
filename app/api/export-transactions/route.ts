import { type NextRequest, NextResponse } from "next/server"
import {
  fetchEvmTransactionHistory,
  fetchTronTransactionHistory,
  convertToCSV,
  type ExportOptions,
} from "@/lib/tools/transaction-history"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { addresses, period, locale = "en" } = await req.json()

    console.log("[v0] Export request:", { addresses, period, locale })

    const options: ExportOptions = { period }

    // Fetch EVM transactions
    let evmTransactions: any[] = []
    if (addresses?.evm) {
      evmTransactions = await fetchEvmTransactionHistory(addresses.evm, options, process.env.DEBANK_API_KEY)
      console.log("[v0] Fetched", evmTransactions.length, "EVM transactions")
    }

    // Fetch TRON transactions
    let tronTransactions: any[] = []
    if (addresses?.tron) {
      tronTransactions = await fetchTronTransactionHistory(addresses.tron, options, process.env.TRONSCAN_API_KEY)
      console.log("[v0] Fetched", tronTransactions.length, "TRON transactions")
    }

    // Convert to CSV
    const csv = convertToCSV(evmTransactions, tronTransactions, locale)

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions_${period}_${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Export API error:", error)
    return NextResponse.json(
      {
        error: "Failed to export transactions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
