import { z } from "zod"

// Message schema
export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
})

export type Message = z.infer<typeof MessageSchema>

// Action schemas
export const OpenUrlActionSchema = z.object({
  type: z.literal("open_url"),
  label: z.string(),
  url: z.string(),
  description: z.string().optional(),
  target: z.enum(["_blank", "_self"]).optional(),
})

export const DeeplinkActionSchema = z.object({
  type: z.literal("deeplink"),
  label: z.string(),
  url: z.string(),
  description: z.string().optional(),
})

export const WalletAddChainActionSchema = z.object({
  type: z.literal("wallet_add_chain"),
  label: z.string(),
  chain: z.object({
    chainId: z.number(),
    chainName: z.string(),
    rpcUrls: z.array(z.string()),
    nativeCurrency: z.object({
      name: z.string(),
      symbol: z.string(),
      decimals: z.number(),
    }),
    blockExplorerUrls: z.array(z.string()).optional(),
    etherscanApiUrl: z.string().optional(),
  }),
  description: z.string().optional(),
})

export const WalletSwitchChainActionSchema = z.object({
  type: z.literal("wallet_switch_chain"),
  label: z.string(),
  chainId: z.number(),
  description: z.string().optional(),
})

export const WalletSendTxActionSchema = z.object({
  type: z.literal("wallet_send_tx"),
  label: z.string(),
  tx: z.object({
    to: z.string(),
    value: z.string().optional(),
    data: z.string().optional(),
  }),
  description: z.string().optional(),
})

export const WalletSignActionSchema = z.object({
  type: z.literal("wallet_sign"),
  label: z.string(),
  sign: z.object({
    method: z.enum(["personal_sign", "eth_signTypedData_v4"]),
    message: z.string().optional(),
    typedData: z.record(z.any()).optional(),
  }),
  description: z.string().optional(),
})

export const ExportTransactionActionSchema = z.object({
  type: z.literal("export_transactions"),
  label: z.string(),
  addresses: z.object({
    evm: z.string().optional(),
    tron: z.string().optional(),
  }),
  period: z.enum(["1week", "1month", "3months"]),
  description: z.string().optional(),
})

export const RecommendDAppActionSchema = z.object({
  type: z.literal("recommend_dapp"),
  label: z.string(),
  dapp: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    url: z.string(),
    risks: z.string(),
    bestFor: z.array(z.string()),
  }),
  description: z.string().optional(),
})

export const UIActionSchema = z.object({
  type: z.enum([
    "open_url",
    "deeplink",
    "wallet_add_chain",
    "wallet_switch_chain",
    "wallet_send_tx",
    "wallet_sign",
    "export_transactions",
    "recommend_dapp", // Added recommend_dapp type
  ]),
  label: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
  target: z.enum(["_blank", "_self"]).optional(),
  dapp: z
    .object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
      features: z.array(z.string()),
      url: z.string(),
      risks: z.string(),
      bestFor: z.array(z.string()),
    })
    .optional(),
  chain: z
    .object({
      chainId: z.number(),
      chainName: z.string(),
      rpcUrls: z.array(z.string()),
      nativeCurrency: z.object({
        name: z.string(),
        symbol: z.string(),
        decimals: z.number(),
      }),
      blockExplorerUrls: z.array(z.string()).optional(),
      etherscanApiUrl: z.string().optional(),
    })
    .optional(),
  chainId: z.number().optional(),
  tx: z
    .object({
      to: z.string(),
      value: z.string().optional(),
      data: z.string().optional(),
    })
    .optional(),
  sign: z
    .object({
      method: z.enum(["personal_sign", "eth_signTypedData_v4"]),
      message: z.string().optional(),
      typedData: z.record(z.any()).optional(),
    })
    .optional(),
  addresses: z
    .object({
      evm: z.string().optional(),
      tron: z.string().optional(),
    })
    .optional(),
  period: z.enum(["1week", "1month", "3months"]).optional(),
})

export type UIAction = z.infer<typeof UIActionSchema>

const ToolRequestSchema = z
  .object({
    tool: z.string(),
    args: z.record(z.any()).optional(),
    params: z.record(z.any()).optional(),
  })
  .transform((data) => ({
    tool: data.tool,
    args: data.args || data.params || {},
  }))

// LLM Response schema
export const LLMResponseSchema = z.object({
  assistant_message: z.string(),
  actions: z.array(UIActionSchema).optional().default([]),
  tool_requests: z.array(ToolRequestSchema).optional().default([]),
  memory: z.record(z.any()).optional().default({}),
})

export type LLMResponse = z.infer<typeof LLMResponseSchema>
