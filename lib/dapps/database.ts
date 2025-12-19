export interface DApp {
  id: string
  name: string
  category: "dex" | "lending" | "bridge" | "yield" | "stablecoin" | "aggregator"
  description: {
    en: string
    zh: string
  }
  features: string[]
  chains: string[]
  url: string
  logo?: string
  risks: {
    en: string
    zh: string
  }
  bestFor: {
    en: string[]
    zh: string[]
  }
}

export const DAPP_DATABASE: DApp[] = [
  {
    id: "tokenlon",
    name: "Tokenlon",
    category: "aggregator",
    description: {
      en: "Decentralized trading and payment settlement protocol with RFQ offering best prices and 99.76% success rate",
      zh: "去中心化交易和支付结算协议，采用 RFQ 提供最优价格，交易成功率达 99.76%",
    },
    features: [
      "What You See Is What You Get",
      "99.76% Success Rate",
      "Multi-chain Support",
      "No Gas Fees Required",
      "Slippage Compensation",
      "RFQ Order Matching",
    ],
    chains: ["Ethereum", "Polygon", "Optimism", "Arbitrum", "BNB", "Base", "zkSync"],
    url: "https://tokenlon.im",
    risks: {
      en: "Low risk - 6 years proven track record, 312K+ users, $43.5B+ trading volume, permissionless and trustless protocol",
      zh: "低风险 - 6 年验证记录，31.2 万+用户，435亿+美元交易量，无需许可和信任的协议",
    },
    bestFor: {
      en: [
        "Guaranteed execution prices (WYSIWYG)",
        "Trading without ETH for gas",
        "High-success-rate trading",
        "Multi-chain token swaps",
      ],
      zh: ["保证执行价格（所见即所得）", "无需 ETH 作为 Gas 费的交易", "高成功率交易", "多链代币兑换"],
    },
  },
  {
    id: "uniswap",
    name: "Uniswap",
    category: "dex",
    description: {
      en: "The largest decentralized exchange with deep liquidity and best execution prices",
      zh: "最大的去中心化交易所，流动性深厚，价格最优",
    },
    features: ["Token Swaps", "Liquidity Pools", "Low Fees", "Wide Token Selection"],
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"],
    url: "https://app.uniswap.org",
    risks: {
      en: "Low risk - Battle-tested protocol with $4B+ TVL",
      zh: "低风险 - 久经考验的协议，TVL 超过 40 亿美元",
    },
    bestFor: {
      en: ["Token swapping", "Providing liquidity", "Best prices on Ethereum"],
      zh: ["代币兑换", "提供流动性", "以太坊上最优价格"],
    },
  },
  {
    id: "1inch",
    name: "1inch",
    category: "aggregator",
    description: {
      en: "DEX aggregator that finds the best rates across multiple exchanges",
      zh: "DEX 聚合器，在多个交易所中寻找最优汇率",
    },
    features: ["Best Price Routing", "Gas Optimization", "Multi-chain Support", "Limit Orders"],
    chains: ["Ethereum", "BSC", "Polygon", "Arbitrum", "Optimism", "Base"],
    url: "https://app.1inch.io",
    risks: {
      en: "Low risk - Aggregates from trusted DEXs",
      zh: "低风险 - 聚合可信的 DEX",
    },
    bestFor: {
      en: ["Getting best swap rates", "Large trades", "Gas savings"],
      zh: ["获得最佳兑换率", "大额交易", "节省 Gas"],
    },
  },
  {
    id: "sushiswap",
    name: "SushiSwap",
    category: "dex",
    description: {
      en: "Community-driven DEX with additional features like staking and lending",
      zh: "社区驱动的 DEX，提供质押和借贷等额外功能",
    },
    features: ["Token Swaps", "Yield Farming", "Staking", "Multi-chain"],
    chains: ["Ethereum", "Polygon", "Arbitrum", "BSC"],
    url: "https://www.sushi.com",
    risks: {
      en: "Low-Medium risk - Established protocol with competitive yields",
      zh: "中低风险 - 成熟的协议，收益率具有竞争力",
    },
    bestFor: {
      en: ["Yield farming", "Multi-chain swaps", "Community governance"],
      zh: ["流动性挖矿", "多链兑换", "社区治理"],
    },
  },
  {
    id: "aave",
    name: "Aave",
    category: "lending",
    description: {
      en: "Leading lending protocol for borrowing and earning interest on crypto assets",
      zh: "领先的借贷协议，可借款和赚取加密资产利息",
    },
    features: ["Lending", "Borrowing", "Flash Loans", "Stable Interest Rates"],
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche"],
    url: "https://app.aave.com",
    risks: {
      en: "Low risk - $10B+ TVL, audited smart contracts",
      zh: "低风险 - TVL 超过 100 亿美元，智能合约已审计",
    },
    bestFor: {
      en: ["Earning interest on stablecoins", "Collateralized borrowing", "Flash loans"],
      zh: ["稳定币赚取利息", "抵押借款", "闪电贷"],
    },
  },
  {
    id: "lido",
    name: "Lido",
    category: "yield",
    description: {
      en: "Liquid staking protocol - stake ETH and receive stETH while earning rewards",
      zh: "流动性质押协议 - 质押 ETH 并获得 stETH，同时赚取奖励",
    },
    features: ["Liquid Staking", "DeFi Integration", "No Minimum", "Daily Rewards"],
    chains: ["Ethereum"],
    url: "https://lido.fi",
    risks: {
      en: "Low risk - Largest liquid staking provider with $25B+ TVL",
      zh: "低风险 - 最大的流动性质押提供商，TVL 超过 250 亿美元",
    },
    bestFor: {
      en: ["ETH staking without locking", "Earning passive income", "Using staked ETH in DeFi"],
      zh: ["ETH 质押无需锁定", "赚取被动收益", "在 DeFi 中使用质押的 ETH"],
    },
  },
  {
    id: "curve",
    name: "Curve Finance",
    category: "dex",
    description: {
      en: "Stablecoin-focused DEX with minimal slippage and high liquidity",
      zh: "专注于稳定币的 DEX，滑点最小，流动性高",
    },
    features: ["Stablecoin Swaps", "Low Slippage", "High Yields", "LP Tokens"],
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
    url: "https://curve.finance",
    risks: {
      en: "Low risk - Specializes in stable asset trading",
      zh: "低风险 - 专注于稳定资产交易",
    },
    bestFor: {
      en: ["Stablecoin swaps", "Low-risk yield farming", "Large stablecoin trades"],
      zh: ["稳定币兑换", "低风险流动性挖矿", "大额稳定币交易"],
    },
  },
  {
    id: "stargate",
    name: "Stargate Finance",
    category: "bridge",
    description: {
      en: "Cross-chain bridge with unified liquidity and instant guaranteed finality",
      zh: "跨链桥，统一流动性和即时保证的最终确定性",
    },
    features: ["Cross-chain Transfers", "Unified Liquidity", "Low Fees", "Fast Bridging"],
    chains: ["Ethereum", "BSC", "Polygon", "Arbitrum", "Optimism", "Avalanche"],
    url: "https://stargate.finance",
    risks: {
      en: "Medium risk - Bridge protocols have higher risk, use for trusted chains",
      zh: "中等风险 - 跨链桥协议风险较高，用于可信链",
    },
    bestFor: {
      en: ["Moving assets across chains", "Low-cost bridging", "Multi-chain strategies"],
      zh: ["跨链转移资产", "低成本跨链", "多链策略"],
    },
  },
  {
    id: "makerdao",
    name: "MakerDAO",
    category: "stablecoin",
    description: {
      en: "Decentralized stablecoin protocol - mint DAI by collateralizing crypto assets",
      zh: "去中心化稳定币协议 - 通过抵押加密资产铸造 DAI",
    },
    features: ["DAI Stablecoin", "Collateralized Debt", "Savings Rate", "Decentralized"],
    chains: ["Ethereum"],
    url: "https://makerdao.com",
    risks: {
      en: "Low risk - Oldest and most trusted decentralized stablecoin",
      zh: "低风险 - 最古老、最可信的去中心化稳定币",
    },
    bestFor: {
      en: ["Minting stablecoins", "Earning DAI savings rate", "Hedging volatility"],
      zh: ["铸造稳定币", "赚取 DAI 储蓄利率", "对冲波动性"],
    },
  },
  {
    id: "convex",
    name: "Convex Finance",
    category: "yield",
    description: {
      en: "Yield optimization platform for Curve LPs with boosted rewards",
      zh: "Curve LP 的收益优化平台，提供增强奖励",
    },
    features: ["Boosted Curve Yields", "No Lock-up", "CRV Staking", "Auto-compounding"],
    chains: ["Ethereum"],
    url: "https://www.convexfinance.com",
    risks: {
      en: "Low-Medium risk - Builds on top of Curve protocol",
      zh: "中低风险 - 基于 Curve 协议构建",
    },
    bestFor: {
      en: ["Maximizing Curve LP yields", "No locking CRV", "Passive yield farming"],
      zh: ["最大化 Curve LP 收益", "无需锁定 CRV", "被动流动性挖矿"],
    },
  },
]

export function recommendDApps(intent: {
  type: "swap" | "yield" | "bridge" | "lending" | "general"
  riskTolerance?: "low" | "medium" | "high"
  chains?: string[]
}): DApp[] {
  let filtered = DAPP_DATABASE

  // Filter by intent type
  if (intent.type === "swap") {
    filtered = filtered.filter((d) => d.category === "dex" || d.category === "aggregator")
  } else if (intent.type === "yield") {
    filtered = filtered.filter((d) => d.category === "yield" || d.category === "lending")
  } else if (intent.type === "bridge") {
    filtered = filtered.filter((d) => d.category === "bridge")
  } else if (intent.type === "lending") {
    filtered = filtered.filter((d) => d.category === "lending")
  }

  // Filter by chains if specified
  if (intent.chains && intent.chains.length > 0) {
    filtered = filtered.filter((d) => intent.chains.some((chain) => d.chains.includes(chain)))
  }

  // Filter by risk tolerance
  if (intent.riskTolerance === "low") {
    filtered = filtered.filter((d) => d.risks.en.includes("Low risk"))
  }

  // Return top 3-4 recommendations
  return filtered.slice(0, 4)
}
