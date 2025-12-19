export interface ChainConfig {
  chainId: number
  chainName: string
  rpcUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
  etherscanApiUrl?: string
}

export const SUPPORTED_EVM_CHAINS: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://eth.llamarpc.com"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  56: {
    chainId: 56,
    chainName: "BSC",
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://bscscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  137: {
    chainId: 137,
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  10: {
    chainId: 10,
    chainName: "Optimism",
    rpcUrls: ["https://mainnet.optimism.io"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  8453: {
    chainId: 8453,
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://basescan.org"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  324: {
    chainId: 324,
    chainName: "zkSync",
    rpcUrls: ["https://mainnet.era.zksync.io"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://explorer.zksync.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  43114: {
    chainId: 43114,
    chainName: "Avalanche",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    blockExplorerUrls: ["https://snowtrace.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  42161: {
    chainId: 42161,
    chainName: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://arbiscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  59144: {
    chainId: 59144,
    chainName: "Linea",
    rpcUrls: ["https://rpc.linea.build"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://lineascan.build"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  534352: {
    chainId: 534352,
    chainName: "Scroll",
    rpcUrls: ["https://rpc.scroll.io"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://scrollscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  81457: {
    chainId: 81457,
    chainName: "Blast",
    rpcUrls: ["https://rpc.blast.io"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://blastscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  5000: {
    chainId: 5000,
    chainName: "Mantle",
    rpcUrls: ["https://rpc.mantle.xyz"],
    nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
    blockExplorerUrls: ["https://explorer.mantle.xyz"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  42170: {
    chainId: 42170,
    chainName: "Arbitrum Nova",
    rpcUrls: ["https://nova.arbitrum.io/rpc"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://nova.arbiscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  4200: {
    chainId: 4200,
    chainName: "Merlin",
    rpcUrls: ["https://rpc.merlinchain.io"],
    nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
    blockExplorerUrls: ["https://scan.merlinchain.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  80094: {
    chainId: 80094,
    chainName: "Berachain Mainnet",
    rpcUrls: ["https://rpc.berachain.com"],
    nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
    blockExplorerUrls: ["https://beratrail.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  204: {
    chainId: 204,
    chainName: "opBNB Mainnet",
    rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://opbnbscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  999: {
    chainId: 999,
    chainName: "HyperEVM",
    rpcUrls: ["https://rpc.hyperliquid.xyz/evm"],
    nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
    blockExplorerUrls: ["https://purrsec.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  747474: {
    chainId: 747474,
    chainName: "Katana Mainnet",
    rpcUrls: ["https://rpc.katana.so"],
    nativeCurrency: { name: "RON", symbol: "RON", decimals: 18 },
    blockExplorerUrls: ["https://katanascan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  143: {
    chainId: 143,
    chainName: "Monad Mainnet",
    rpcUrls: ["https://rpc.monad.xyz"],
    nativeCurrency: { name: "MONAD", symbol: "MONAD", decimals: 18 },
    blockExplorerUrls: ["https://monadscan.xyz"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  100: {
    chainId: 100,
    chainName: "Gnosis",
    rpcUrls: ["https://rpc.gnosischain.com"],
    nativeCurrency: { name: "xDAI", symbol: "xDAI", decimals: 18 },
    blockExplorerUrls: ["https://gnosisscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  42220: {
    chainId: 42220,
    chainName: "Celo",
    rpcUrls: ["https://forno.celo.org"],
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    blockExplorerUrls: ["https://celoscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  1284: {
    chainId: 1284,
    chainName: "Moonbeam",
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    nativeCurrency: { name: "GLMR", symbol: "GLMR", decimals: 18 },
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  252: {
    chainId: 252,
    chainName: "Fraxtal",
    rpcUrls: ["https://rpc.fraxtal.com"],
    nativeCurrency: { name: "FTX", symbol: "FTX", decimals: 18 },
    blockExplorerUrls: ["https://fraxtalscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  167000: {
    chainId: 167000,
    chainName: "Taiko",
    rpcUrls: ["https://rpc.taiko.xyz"],
    nativeCurrency: { name: "TAI", symbol: "TAI", decimals: 18 },
    blockExplorerUrls: ["https://explorer.taiko.xyz"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  480: {
    chainId: 480,
    chainName: "World Mainnet",
    rpcUrls: ["https://rpc.worldchain.io"],
    nativeCurrency: { name: "WLD", symbol: "WLD", decimals: 18 },
    blockExplorerUrls: ["https://worldscan.org"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  146: {
    chainId: 146,
    chainName: "Sonic",
    rpcUrls: ["https://rpc.sonicnetwork.io"],
    nativeCurrency: { name: "SONIC", symbol: "SONIC", decimals: 18 },
    blockExplorerUrls: ["https://sonicscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  1329: {
    chainId: 1329,
    chainName: "Sei Mainnet",
    rpcUrls: ["https://sei-public.nodies.app"],
    nativeCurrency: { name: "SEI", symbol: "SEI", decimals: 18 },
    blockExplorerUrls: ["https://seistream.app"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  199: {
    chainId: 199,
    chainName: "BitTorrent",
    rpcUrls: ["https://rpc.bittorrentchain.io"],
    nativeCurrency: { name: "BTT", symbol: "BTT", decimals: 18 },
    blockExplorerUrls: ["https://bttscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  130: {
    chainId: 130,
    chainName: "Unichain",
    rpcUrls: ["https://rpc.unichain.network"],
    nativeCurrency: { name: "UNI", symbol: "UNI", decimals: 18 },
    blockExplorerUrls: ["https://unichainscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  2741: {
    chainId: 2741,
    chainName: "Abstract",
    rpcUrls: ["https://rpc.abstract.network"],
    nativeCurrency: { name: "ABS", symbol: "ABS", decimals: 18 },
    blockExplorerUrls: ["https://abstractscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  33139: {
    chainId: 33139,
    chainName: "ApeChain Mainnet",
    rpcUrls: ["https://rpc.apechain.com"],
    nativeCurrency: { name: "APE", symbol: "APE", decimals: 18 },
    blockExplorerUrls: ["https://apescan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  80094: {
    chainId: 80094,
    chainName: "Berachain Mainnet",
    rpcUrls: ["https://rpc.berachain.com"],
    nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
    blockExplorerUrls: ["https://beratrail.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  1923: {
    chainId: 1923,
    chainName: "Swellchain",
    rpcUrls: ["https://rpc.swellchain.io"],
    nativeCurrency: { name: "SWELL", symbol: "SWELL", decimals: 18 },
    blockExplorerUrls: ["https://swellscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  143: {
    chainId: 143,
    chainName: "Monad Mainnet",
    rpcUrls: ["https://rpc.monad.xyz"],
    nativeCurrency: { name: "MONAD", symbol: "MONAD", decimals: 18 },
    blockExplorerUrls: ["https://monadscan.xyz"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  999: {
    chainId: 999,
    chainName: "HyperEVM",
    rpcUrls: ["https://rpc.hyperliquid.xyz/evm"],
    nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
    blockExplorerUrls: ["https://purrsec.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  988: {
    chainId: 988,
    chainName: "Stable Mainnet",
    rpcUrls: ["https://rpc.stable.network"],
    nativeCurrency: { name: "STABLE", symbol: "STABLE", decimals: 18 },
    blockExplorerUrls: ["https://stablescan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  1285: {
    chainId: 1285,
    chainName: "Moonriver",
    rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
    nativeCurrency: { name: "MOVR", symbol: "MOVR", decimals: 18 },
    blockExplorerUrls: ["https://moonriver.moonscan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  50: {
    chainId: 50,
    chainName: "XDC",
    rpcUrls: ["https://rpc.xinfin.network"],
    nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
    blockExplorerUrls: ["https://explorer.xinfin.network"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  747474: {
    chainId: 747474,
    chainName: "Katana Mainnet",
    rpcUrls: ["https://rpc.katana.so"],
    nativeCurrency: { name: "RON", symbol: "RON", decimals: 18 },
    blockExplorerUrls: ["https://katanascan.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  250: {
    chainId: 250,
    chainName: "Fantom",
    rpcUrls: ["https://rpc.fantom.network"],
    nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 },
    blockExplorerUrls: ["https://ftmscan.com"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
  4200: {
    chainId: 4200,
    chainName: "Merlin",
    rpcUrls: ["https://rpc.merlinchain.io"],
    nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
    blockExplorerUrls: ["https://scan.merlinchain.io"],
    etherscanApiUrl: "https://api.etherscan.io/v2/api",
  },
}

export function getChainById(chainId: number): ChainConfig | undefined {
  return SUPPORTED_EVM_CHAINS[chainId]
}

export function getChainByIdString(chainId: string): ChainConfig | undefined {
  return SUPPORTED_EVM_CHAINS[Number(chainId)]
}

export function ensureEvmChainSupported(chainId: number): boolean {
  return chainId in SUPPORTED_EVM_CHAINS
}

export function getAllSupportedChainIds(): number[] {
  return Object.keys(SUPPORTED_EVM_CHAINS).map(Number)
}

export const PRIORITY_CHAIN_IDS = [
  // Most common chains first
  1, // Ethereum
  56, // BSC
  137, // Polygon
  42161, // Arbitrum One
  10, // Optimism
  8453, // Base
  324, // zkSync
  43114, // Avalanche
  // Popular L2s
  59144, // Linea
  534352, // Scroll
  81457, // Blast
  5000, // Mantle
  42170, // Arbitrum Nova
  204, // opBNB
  // Other chains
  100, // Gnosis
  42220, // Celo
  1284, // Moonbeam
  252, // Fraxtal
  167000, // Taiko
  480, // World
  146, // Sonic
  1329, // Sei
  199, // BitTorrent
  130, // Unichain
  2741, // Abstract
  33139, // ApeChain
  80094, // Berachain
  1923, // Swellchain
  143, // Monad
  999, // HyperEVM
  988, // Stable
  // Less common
  1285, // Moonriver
  50, // XDC
  747474, // Katana
  250, // Fantom
  4200, // Merlin
]
