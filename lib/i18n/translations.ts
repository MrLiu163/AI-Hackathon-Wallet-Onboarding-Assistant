export type Locale = "en" | "zh"

export const translations = {
  en: {
    // Header
    appName: "imToken Copilot",
    connectWallet: "Connect Wallet",
    disconnect: "Disconnect",

    // Welcome screen
    welcomeTitle: "Welcome to imToken",
    welcomeSubtitle: "Digital assets under your control",
    tryPasting: "Try clicking the options below to quickly resolve the issue:",
    pasteHashButton: "I've received the funds, but I can't find the assets",
    defiQuestion: "How do I earn DeFi yields?",
    analyzeWallet: '"Analyze my wallet portfolio"',
    exportTxRecords: "Export my transaction history",
    faqAnswers: "What is Ethereum Interop?",
    swapMyTokens: "How can I swap USDT into ETH?",

    // Chat input
    placeholderConnected: "If you have any questions, feel free to let me know....",
    placeholderDisconnected: "If you have any questions, feel free to let me know....",

    // Action buttons
    quickActions: "Quick Actions:",
    viewOnExplorer: "View on Explorer",
    addAccount: "Add Account",

    // Export transactions
    exportTransactions: "Export Transactions",
    exportLastWeek: "Export Last Week",
    exportLastMonth: "Export Last Month",
    exportLast3Months: "Export Last 3 Months",
    exportingTitle: "Exporting",
    exportingDesc: "Preparing your transaction history...",
    exportSuccessDesc: "Transaction history exported successfully",
    exportErrorDesc: "Failed to export transaction history",

    // Toasts
    connectWalletTitle: "Connect your wallet",
    connectWalletDesc: "Click the 'Connect Wallet' button in the top right corner",
    walletNotDetected: "Wallet not detected",
    walletNotDetectedDesc: "Please install MetaMask or another Web3 wallet",
    walletNotConnected: "Wallet not connected",
    walletNotConnectedDesc: "Please connect your wallet first",
    successTitle: "Success",
    chainSwitched: "Chain switched successfully",
    txSent: "Transaction sent successfully",
    messageSigned: "Message signed successfully",
    errorTitle: "Error",
    actionFailed: "Action failed",
    chatError: "Failed to get response. Please try again.",
    addedAccount: "Added account on",
    addChainError: "Failed to add network and account",

    // DApp recommendations
    openingDApp: "Opening",
    dappRecommendations: "DApp Recommendations",
    lowRisk: "Low Risk",
    mediumRisk: "Medium Risk",
    highRisk: "High Risk",
    bestFor: "Best for:",
    features: "Features:",
    risks: "Risks:",
  },
  zh: {
    // Header
    appName: "imToken 小助手",
    connectWallet: "连接钱包",
    disconnect: "断开连接",

    // Welcome screen
    welcomeTitle: "欢迎来到 imToken",
    welcomeSubtitle: "数字资产，尽在掌控",
    tryPasting: "试试点击下面选项，快速解决问题：",
    pasteHashButton: "我已收款，但无法找到正确账户",
    defiQuestion: "如何安全获取 DeFi 收益？",
    analyzeWallet: "分析我的投资组合",
    exportTxRecords: "导出我的交易记录",
    faqAnswers: "什么是以太坊 Interop ？",
    swapMyTokens: "如何将 USDT 兑换为 ETH ？",

    // Chat input
    placeholderConnected: "如果有任何疑问，不妨告诉我...",
    placeholderDisconnected: "如果有任何疑问，不妨告诉我...",

    // Action buttons
    quickActions: "快捷操作：",
    viewOnExplorer: "在浏览器中查看",
    addAccount: "添加账户",

    // Export transactions
    exportTransactions: "导出交易记录",
    exportLastWeek: "导出最近一周",
    exportLastMonth: "导出最近一个月",
    exportLast3Months: "导出最近三个月",
    exportingTitle: "导出中",
    exportingDesc: "正在准备你的交易记录...",
    exportSuccessDesc: "交易记录导出成功",
    exportErrorDesc: "交易记录导出失败",

    // Toasts
    connectWalletTitle: "连接你的钱包",
    connectWalletDesc: '点击右上角的「连接钱包」按钮',
    walletNotDetected: "未检测到钱包",
    walletNotDetectedDesc: "请安装 imToken 或其他 Web3 钱包",
    walletNotConnected: "钱包未连接",
    walletNotConnectedDesc: "请先连接你的钱包",
    successTitle: "成功",
    chainSwitched: "网络切换成功",
    txSent: "交易发送成功",
    messageSigned: "消息签名成功",
    errorTitle: "错误",
    actionFailed: "操作失败",
    chatError: "无法获取响应，请重试。",
    addedAccount: "已添加账户于",
    addChainError: "添加网络和账户失败",

    // DApp recommendations
    openingDApp: "打开中",
    dappRecommendations: "DApp 推荐",
    lowRisk: "低风险",
    mediumRisk: "中等风险",
    highRisk: "高风险",
    bestFor: "适用于：",
    features: "功能：",
    risks: "风险：",
  },
}

export function getTranslations(locale: Locale) {
  return translations[locale]
}
