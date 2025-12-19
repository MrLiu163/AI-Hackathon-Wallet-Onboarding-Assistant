import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { SYSTEM_PROMPT } from "@/lib/llm/system-prompt"
import { LLMResponseSchema } from "@/lib/schema"
import { detectChainFromTxHash } from "@/lib/tools/etherscan"
import { getPortfolio } from "@/lib/tools/debank"
import { getChainById, getChainByIdString } from "@/lib/chains/registry"
import { recommendDApps } from "@/lib/dapps/database"
import { searchZendeskArticles, deduplicateArticles } from "@/lib/tools/zendesk"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { messages, address, locale = "en" } = await req.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const contextMessage = address
      ? `User's connected wallet address: ${address}`
      : "User has not connected a wallet yet"

    const lastUserMessage = messages.filter((m: any) => m.role === "user").slice(-1)[0]?.content || ""

    // Simple language detection: check for Chinese characters
    const hasChinese = /[\u4e00-\u9fa5]/.test(lastUserMessage)
    const detectedLanguage = hasChinese ? "zh" : "en"

    // Use detected language if different from UI language for KB searches
    const responseLanguage = detectedLanguage

    console.log("[v0] UI Locale:", locale, "| Detected Language:", detectedLanguage, "| Using:", responseLanguage)

    const localeContext =
      responseLanguage === "zh"
        ? "IMPORTANT: The user is asking in Chinese. You MUST respond in Chinese (Simplified Chinese). All your assistant_message responses must be in Chinese."
        : "The user is asking in English. You MUST respond in English. All your assistant_message responses must be in English."

    const planningResponse = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: contextMessage },
        { role: "system", content: localeContext },
        ...messages,
      ],
      temperature: 0.7,
    })

    console.log("[v0] LLM raw response:", planningResponse.text)

    let parsedResponse
    try {
      let jsonText = planningResponse.text.trim()

      // Remove markdown code blocks if present
      if (jsonText.includes("```json")) {
        const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/)
        if (match) jsonText = match[1].trim()
      } else if (jsonText.includes("```")) {
        const match = jsonText.match(/```\s*([\s\S]*?)\s*```/)
        if (match) jsonText = match[1].trim()
      }

      // Extract JSON object from text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }

      console.log("[v0] Extracted JSON text:", jsonText)
      const rawParsed = JSON.parse(jsonText)
      console.log("[v0] Raw parsed object:", JSON.stringify(rawParsed, null, 2))

      try {
        parsedResponse = LLMResponseSchema.parse(rawParsed)
        console.log("[v0] Validated response:", JSON.stringify(parsedResponse, null, 2))
      } catch (zodError) {
        console.error("[v0] Zod validation error:", zodError)
        parsedResponse = {
          assistant_message: rawParsed.assistant_message || "I'm processing your request...",
          actions: Array.isArray(rawParsed.actions) ? rawParsed.actions : [],
          tool_requests: Array.isArray(rawParsed.tool_requests) ? rawParsed.tool_requests : [],
          memory: rawParsed.memory || {},
        }
        console.log("[v0] Using salvaged response:", parsedResponse)
      }
    } catch (error) {
      console.error("[v0] Failed to parse LLM response:", error)
      console.error("[v0] Raw response:", planningResponse.text)

      return NextResponse.json({
        assistant_message:
          "I apologize, but I encountered an error processing your request. Could you please rephrase?",
        actions: [],
      })
    }

    if (parsedResponse.tool_requests && parsedResponse.tool_requests.length > 0) {
      for (const toolRequest of parsedResponse.tool_requests) {
        const toolArgs = toolRequest.args || {}

        console.log("[v0] Executing tool:", toolRequest.tool, "with args:", toolArgs)

        if (toolRequest.tool === "detect_chain") {
          const txHash = toolArgs.tx_hash || toolArgs.txHash
          if (!txHash) {
            console.error("[v0] Missing tx_hash parameter")
            continue
          }

          console.log("[v0] Detecting chain for txHash:", txHash)
          const result = await detectChainFromTxHash(
            txHash,
            process.env.ETHERSCAN_API_KEY,
            process.env.CHAINBASE_API_KEY,
          )
          console.log("[v0] Chain detection result:", result)

          if (result.found && result.chainId) {
            const chainConfig = getChainByIdString(result.chainId) || getChainById(Number(result.chainId))

            if (chainConfig) {
              parsedResponse.actions = parsedResponse.actions || []

              parsedResponse.actions.push({
                type: "wallet_add_chain",
                label: `Add ${chainConfig.chainName} Account`,
                chain: chainConfig,
                description: `Switch to ${chainConfig.chainName} and add account`,
              })

              parsedResponse.actions.push({
                type: "open_url",
                label: "View on Explorer",
                url: result.explorerTxUrl || "",
                description: "View transaction details on block explorer",
              })

              parsedResponse.assistant_message = `I found your transaction on **${result.chainName || chainConfig.chainName}**! Click the button below to switch to this network and add an account. If the network isn't in your wallet yet, it will be added automatically.`
            } else {
              parsedResponse.assistant_message = `I found your transaction on **${result.chainName}** (Chain ID: ${result.chainId}), but this chain is not currently configured in the app. You can view it on the explorer: ${result.explorerTxUrl}`

              parsedResponse.actions = parsedResponse.actions || []
              parsedResponse.actions.push({
                type: "open_url",
                label: "View on Explorer",
                url: result.explorerTxUrl || "",
                description: "View transaction details on block explorer",
              })
            }
          } else {
            parsedResponse.assistant_message =
              "I couldn't find this transaction on any of the supported blockchain networks. Please verify the transaction hash is correct and the transaction has been confirmed."
          }
        } else if (toolRequest.tool === "get_portfolio") {
          const portfolioAddress = toolArgs.address || address
          if (portfolioAddress) {
            console.log("[v0] Fetching portfolio for address:", portfolioAddress)
            const result = await getPortfolio(portfolioAddress, process.env.DEBANK_API_KEY)
            console.log("[v0] Portfolio result:", result)

            if (result && result.totalUsdValue !== undefined) {
              const chainCount = result.chainList?.length || 0
              const tokenCount = result.tokens?.length || 0

              let message = `Your wallet portfolio has a total value of **$${result.totalUsdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**. `

              if (chainCount > 0) {
                message += `Assets are distributed across **${chainCount} blockchain networks**. `
              }

              if (tokenCount > 0) {
                message += `You hold **${tokenCount} different tokens**. `

                const topTokens = result.tokens
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((t) => `${t.symbol} ($${t.value.toFixed(2)})`)
                  .join(", ")

                message += `\n\nTop assets: ${topTokens}`
              }

              parsedResponse.assistant_message = message
            } else {
              parsedResponse.assistant_message =
                "I couldn't retrieve your portfolio data. Please make sure the wallet address is correct and has been used on supported chains."
            }
          }
        } else if (toolRequest.tool === "export_history") {
          const addresses = toolArgs.addresses || {}
          const period = toolArgs.period || "1month"

          console.log("[v0] Preparing export options for:", addresses, period)

          parsedResponse.actions = parsedResponse.actions || []

          const periodLabels = {
            en: {
              "1week": "Export Last Week",
              "1month": "Export Last Month",
              "3months": "Export Last 3 Months",
            },
            zh: {
              "1week": "导出最近一周",
              "1month": "导出最近一个月",
              "3months": "导出最近三个月",
            },
          }

          const labels = responseLanguage === "zh" ? periodLabels.zh : periodLabels.en
          ;(["1week", "1month", "3months"] as const).forEach((p) => {
            parsedResponse.actions.push({
              type: "export_transactions",
              label: labels[p],
              addresses: {
                evm: addresses.evm || address,
                tron: addresses.tron,
              },
              period: p,
              description: `Export transaction history for ${p}`,
            })
          })

          parsedResponse.assistant_message =
            responseLanguage === "zh"
              ? "我可以帮你导出交易记录。请选择时间范围："
              : "I can export your transaction history. Please choose a time period:"
        } else if (toolRequest.tool === "recommend_dapps") {
          const intent = toolArgs.intent || "general"
          const riskTolerance = toolArgs.risk_tolerance || "low"
          const chains = toolArgs.chains || []

          console.log("[v0] Recommending DApps for intent:", intent, "risk:", riskTolerance)

          const recommendations = recommendDApps({
            type: intent,
            riskTolerance: riskTolerance,
            chains: chains,
          })

          console.log("[v0] Found", recommendations.length, "DApp recommendations")

          parsedResponse.actions = parsedResponse.actions || []

          recommendations.forEach((dapp) => {
            parsedResponse.actions.push({
              type: "recommend_dapp",
              label: `Open ${dapp.name}`,
              dapp: {
                id: dapp.id,
                name: dapp.name,
                category: dapp.category,
                description: responseLanguage === "zh" ? dapp.description.zh : dapp.description.en,
                features: dapp.features,
                url: dapp.url,
                risks: responseLanguage === "zh" ? dapp.risks.zh : dapp.risks.en,
                bestFor: responseLanguage === "zh" ? dapp.bestFor.zh : dapp.bestFor.en,
              },
              description: responseLanguage === "zh" ? dapp.description.zh : dapp.description.en,
            })
          })

          if (recommendations.length > 0) {
            const categoryNames = {
              en: {
                swap: "token swapping",
                yield: "earning yield",
                bridge: "cross-chain bridging",
                lending: "lending and borrowing",
                general: "DeFi",
              },
              zh: {
                swap: "代币兑换",
                yield: "收益",
                bridge: "跨链桥接",
                lending: "借贷",
                general: "DeFi",
              },
            }

            const categoryName = responseLanguage === "zh" ? categoryNames.zh[intent] : categoryNames.en[intent]

            parsedResponse.assistant_message =
              responseLanguage === "zh"
                ? `为你推荐以下${categoryName}平台。这些都是经过验证的协议，具有良好的安全记录。点击按钮可以直接访问：`
                : `I recommend the following platforms for ${categoryName}. These are all battle-tested protocols with strong security records. Click the buttons to visit them:`
          } else {
            parsedResponse.assistant_message =
              responseLanguage === "zh"
                ? "抱歉，暂时没有找到符合你需求的 DApp 推荐。"
                : "Sorry, I couldn't find any DApp recommendations matching your criteria."
          }
        } else if (toolRequest.tool === "search_kb") {
          const query = toolArgs.query || ""
          if (!query) {
            console.error("[v0] Missing query parameter for search_kb")
            continue
          }

          const zendeskLocale = responseLanguage === "zh" ? "zh-cn" : "en-us"
          console.log("[v0] Searching Zendesk KB with locale:", zendeskLocale, "query:", query)

          const result = await searchZendeskArticles(query, zendeskLocale, process.env.ZENDESK_API_KEY)
          console.log("[v0] Zendesk search result:", result)

          if (result.found && result.articles.length > 0) {
            result.articles = deduplicateArticles(result.articles)
          }

          if (result.found && result.articles.length > 0) {
            // Format articles based on detected language
            const articlesInfo = result.articles
              .slice(0, 3)
              .map((article) => {
                const plainBody = article.body.replace(/<[^>]*>/g, "").trim()
                return `**${article.title}**\n${plainBody.substring(0, 300)}...\n${article.html_url}`
              })
              .join("\n\n")

            parsedResponse.actions = parsedResponse.actions || []
            result.articles.slice(0, 3).forEach((article) => {
              parsedResponse.actions.push({
                type: "open_url",
                label: responseLanguage === "zh" ? `查看: ${article.title}` : `View: ${article.title}`,
                url: article.html_url,
                description: article.title,
              })
            })

            if (responseLanguage === "zh") {
              parsedResponse.assistant_message = `${articlesInfo}\n\n点击下方按钮查看完整文章。如需更多帮助，请在 App 中点击 「帮助与反馈」 或发送邮件至 support@token.im 联系人工客服。`
            } else {
              parsedResponse.assistant_message = `${articlesInfo}\n\nClick the buttons below to view full articles. For further assistance, please click [Support & Feedback] in the app or send an email to support@token.im to contact customer service.`
            }
          } else {
            console.log("[v0] No relevant KB articles found, using LLM fallback")
            if (!parsedResponse.assistant_message) {
              parsedResponse.assistant_message =
                responseLanguage === "zh"
                  ? "抱歉，我暂时没有找到相关的内容。请描述你遇到的具体问题，我会尽力帮助你。"
                  : "I couldn't find specific help articles for your question. Please describe your issue and I'll do my best to help."
            }
          }
        }
      }
    }

    return NextResponse.json({
      assistant_message: parsedResponse.assistant_message,
      actions: parsedResponse.actions || [],
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
