export interface ZendeskArticle {
  id: string
  title: string
  body: string
  html_url: string
  locale: string
  label_names?: string[]
}

export interface ZendeskSearchResult {
  found: boolean
  articles: ZendeskArticle[]
  query: string
}

/**
 * Search Zendesk knowledge base articles with fallback to both locales
 * @param query - Search query string
 * @param locale - Primary locale code (zh-cn or en-us)
 * @param apiKey - Zendesk API key
 */
export async function searchZendeskArticles(
  query: string,
  locale: "zh-cn" | "en-us",
  apiKey?: string,
): Promise<ZendeskSearchResult> {
  if (!apiKey) {
    console.error("[v0] Zendesk API key not configured")
    return { found: false, articles: [], query }
  }

  try {
    const primaryResult = await searchZendeskByLocale(query, locale, apiKey)

    // If found articles in primary locale, return them after deduplication
    if (primaryResult.found && primaryResult.articles.length > 0) {
      return { ...primaryResult, articles: deduplicateArticles(primaryResult.articles) }
    }

    // Fallback to alternate locale if primary search returned no results
    const alternateLocale = locale === "zh-cn" ? "en-us" : "zh-cn"
    console.log("[v0] No results in primary locale, trying alternate:", alternateLocale)
    const alternateResult = await searchZendeskByLocale(query, alternateLocale, apiKey)
    return { ...alternateResult, articles: deduplicateArticles(alternateResult.articles) }
  } catch (error) {
    console.error("[v0] Zendesk search error:", error)
    return { found: false, articles: [], query }
  }
}

async function searchZendeskByLocale(
  query: string,
  locale: "zh-cn" | "en-us",
  apiKey: string,
): Promise<ZendeskSearchResult> {
  const url = new URL("https://consenlabs.zendesk.com/api/v2/help_center/articles/search")
  url.searchParams.append("query", query)
  url.searchParams.append("locale", locale)
  url.searchParams.append("per_page", "5")

  console.log("[v0] Searching Zendesk:", url.toString())

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    console.error("[v0] Zendesk API error:", response.status, response.statusText)
    return { found: false, articles: [], query }
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    console.log("[v0] No articles found in Zendesk for locale:", locale)
    return { found: false, articles: [], query }
  }

  const articles: ZendeskArticle[] = data.results.map((article: any) => ({
    id: article.id,
    title: article.title,
    body: article.body || article.snippet || "",
    html_url: article.html_url,
    locale: article.locale,
    label_names: article.label_names || [],
  }))

  return {
    found: true,
    articles,
    query,
  }
}

/**
 * Determine if the user query is a support/knowledge base question
 */
export function isSupportQuery(query: string): boolean {
  const supportKeywords = [
    // Educational/Concept questions
    "什么是",
    "如何",
    "怎么",
    "解释",
    "介绍",
    "说明",
    "教程",
    "what is",
    "how to",
    "how does",
    "explain",
    "introduction",
    "tutorial",
    "guide",
    "learn",
    // Blockchain terms
    "interop",
    "互操作",
    "layer 2",
    "l2",
    "defi",
    "staking",
    "质押",
    "智能合约",
    "smart contract",
    "gas",
    "区块链",
    "blockchain",
    // Password/Security related
    "密码",
    "忘记密码",
    "重置密码",
    "password",
    "forgot password",
    "reset password",
    // Seed phrase/Private key
    "助记词",
    "私钥",
    "seed phrase",
    "mnemonic",
    "private key",
    "recovery phrase",
    "丢失",
    "找不到",
    "lost",
    "missing",
    // App related
    "下载",
    "更新",
    "安装",
    "download",
    "update",
    "install",
    "升级",
    "upgrade",
    // App authenticity
    "真假",
    "官方",
    "验证",
    "authentic",
    "official",
    "verify",
    "fake",
    "scam",
    // Security/Scams
    "骗局",
    "诈骗",
    "钓鱼",
    "安全",
    "被盗",
    "fraud",
    "phishing",
    "security",
    "stolen",
    "hacked",
    // Customer support
    "客服",
    "人工",
    "联系",
    "support",
    "contact",
    "help",
    "customer service",
    // Common issues
    "无法",
    "不能",
    "错误",
    "问题",
    "cannot",
    "unable",
    "error",
    "issue",
    "problem",
    "bug",
  ]

  const lowerQuery = query.toLowerCase()
  return supportKeywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase()))
}

/**
 * Remove duplicate articles with similar titles
 */
export function deduplicateArticles(articles: ZendeskArticle[]): ZendeskArticle[] {
  if (articles.length <= 1) return articles

  const uniqueArticles: ZendeskArticle[] = []
  const seenTitles: string[] = []

  for (const article of articles) {
    // Normalize title for comparison (lowercase, remove special chars)
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim()

    // Check if we've seen a very similar title
    const isDuplicate = seenTitles.some((seenTitle) => {
      // Calculate simple similarity: if titles match >80% of words, consider duplicate
      const seenWords = seenTitle.split(/\s+/)
      const currentWords = normalizedTitle.split(/\s+/)

      const matchingWords = currentWords.filter((word) =>
        seenWords.some((sw) => sw.includes(word) || word.includes(sw)),
      ).length

      const similarity = matchingWords / Math.max(seenWords.length, currentWords.length)
      return similarity > 0.8
    })

    if (!isDuplicate) {
      uniqueArticles.push(article)
      seenTitles.push(normalizedTitle)
    }
  }

  console.log(`[v0] Deduplicated ${articles.length} articles to ${uniqueArticles.length}`)
  return uniqueArticles
}
