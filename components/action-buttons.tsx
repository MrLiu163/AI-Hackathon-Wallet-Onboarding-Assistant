"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ExternalLink, Plus, RefreshCw, FileSignature, Send, Download, Sparkles } from "lucide-react"
import type { UIAction } from "@/lib/schema"
import { useAccount, useSwitchChain, useSendTransaction, useSignMessage, useSignTypedData } from "wagmi"
import { useI18n } from "@/lib/i18n/context"
import { DAppCard } from "./dapp-card"

interface ActionButtonsProps {
  actions: UIAction[]
  onWalletRequired?: () => void
}

export function ActionButtons({ actions, onWalletRequired }: ActionButtonsProps) {
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { signMessageAsync } = useSignMessage()
  const { signTypedDataAsync } = useSignTypedData()
  const { t, locale } = useI18n()

  const checkWalletConnection = (): boolean => {
    if (!window.ethereum) {
      toast({
        title: t.walletNotDetected,
        description: t.walletNotDetectedDesc,
        variant: "destructive",
      })
      return false
    }

    if (!isConnected) {
      toast({
        title: t.walletNotConnected,
        description: t.walletNotConnectedDesc,
        variant: "destructive",
      })
      if (onWalletRequired) {
        onWalletRequired()
      }
      return false
    }

    return true
  }

  const switchToChain = async (chainId: number, chainConfig: any) => {
    const hexChainId = `0x${chainId.toString(16)}`

    try {
      // First, try to switch to the chain
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      })
      console.log("[v0] Successfully switched to chain:", chainId)
      return true
    } catch (error: any) {
      // Error code 4902 means the chain is not added to the wallet
      if (error?.code === 4902) {
        console.log("[v0] Chain not found (4902), adding it first...")
        try {
          // Add the chain
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexChainId,
                chainName: chainConfig.chainName,
                rpcUrls: chainConfig.rpcUrls,
                nativeCurrency: chainConfig.nativeCurrency,
                blockExplorerUrls: chainConfig.blockExplorerUrls,
              },
            ],
          })
          console.log("[v0] Chain added successfully")

          // After adding, switch to the newly added chain
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: hexChainId }],
          })
          console.log("[v0] Switched to newly added chain")
          return true
        } catch (addError: any) {
          console.error("[v0] Failed to add chain:", addError)
          throw addError
        }
      } else {
        throw error
      }
    }
  }

  const handleAction = async (action: UIAction) => {
    try {
      switch (action.type) {
        case "open_url":
          window.open(action.url, action.target || "_blank")
          break

        case "recommend_dapp":
          if (action.dapp?.url) {
            window.location.href = action.dapp.url
            toast({
              title: t.successTitle,
              description: `${t.openingDApp || "Opening"} ${action.dapp.name}`,
            })
          }
          break

        case "deeplink":
          window.location.href = action.url
          break

        case "wallet_add_chain":
          if (!checkWalletConnection()) {
            return
          }

          try {
            console.log("[v0] Starting add chain flow for:", action.chain.chainName)

            await switchToChain(action.chain.chainId, action.chain)

            console.log("[v0] Chain added/switched, now requesting accounts...")
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
            console.log("[v0] Accounts received:", accounts)

            toast({
              title: t.successTitle,
              description: `${t.addedAccount} ${action.chain.chainName}: ${accounts?.[0]?.slice(0, 6)}...${accounts?.[0]?.slice(-4)}`,
            })
          } catch (error: any) {
            console.error("[v0] Add chain and account error:", error)
            toast({
              title: t.errorTitle,
              description: error.message || t.addChainError,
              variant: "destructive",
            })
          }
          break

        case "wallet_switch_chain":
          if (!checkWalletConnection()) {
            return
          }

          await switchChainAsync({ chainId: action.chainId })
          toast({
            title: t.successTitle,
            description: t.chainSwitched,
          })
          break

        case "wallet_send_tx":
          if (!checkWalletConnection()) {
            return
          }

          await sendTransactionAsync({
            to: action.tx.to,
            value: action.tx.value ? BigInt(action.tx.value) : undefined,
            data: action.tx.data,
          })
          toast({
            title: t.successTitle,
            description: t.txSent,
          })
          break

        case "wallet_sign":
          if (!checkWalletConnection()) {
            return
          }

          if (action.sign.method === "personal_sign" && action.sign.message) {
            await signMessageAsync({ message: action.sign.message })
          } else if (action.sign.method === "eth_signTypedData_v4" && action.sign.typedData) {
            await signTypedDataAsync(action.sign.typedData as any)
          }
          toast({
            title: t.successTitle,
            description: t.messageSigned,
          })
          break

        case "export_transactions":
          console.log("[v0] Exporting transactions:", action.period, action.addresses)

          toast({
            title: t.exportingTitle || "Exporting...",
            description: t.exportingDesc || "Preparing your transaction history...",
          })

          try {
            const response = await fetch("/api/export-transactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                addresses: action.addresses,
                period: action.period,
                locale: locale,
              }),
            })

            if (!response.ok) {
              throw new Error("Export failed")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `transactions_${action.period}_${Date.now()}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            toast({
              title: t.successTitle,
              description: t.exportSuccessDesc || "Transaction history exported successfully",
            })
          } catch (error) {
            console.error("[v0] Export error:", error)
            toast({
              title: t.errorTitle,
              description: t.exportErrorDesc || "Failed to export transaction history",
              variant: "destructive",
            })
          }
          break
      }
    } catch (error: any) {
      console.error("[v0] Action error:", error)
      toast({
        title: t.errorTitle,
        description: error.message || t.actionFailed,
        variant: "destructive",
      })
    }
  }

  const getIcon = (type: UIAction["type"]) => {
    switch (type) {
      case "open_url":
      case "deeplink":
        return <ExternalLink className="h-4 w-4" />
      case "recommend_dapp":
        return <Sparkles className="h-4 w-4" />
      case "wallet_add_chain":
        return <Plus className="h-4 w-4" />
      case "wallet_switch_chain":
        return <RefreshCw className="h-4 w-4" />
      case "wallet_sign":
        return <FileSignature className="h-4 w-4" />
      case "wallet_send_tx":
        return <Send className="h-4 w-4" />
      case "export_transactions":
        return <Download className="h-4 w-4" />
    }
  }

  const dappActions = actions.filter((a) => a.type === "recommend_dapp")
  const otherActions = actions.filter((a) => a.type !== "recommend_dapp")

  return (
    <div className="space-y-3">
      {dappActions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            {t.dappRecommendations || "DApp Recommendations"}:
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dappActions.map((action, index) => (
              <DAppCard key={index} dapp={action.dapp!} onOpen={() => handleAction(action)} />
            ))}
          </div>
        </div>
      )}

      {otherActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {otherActions.map((action, index) => (
            <Button key={index} variant="outline" className="gap-2 bg-transparent" onClick={() => handleAction(action)}>
              {getIcon(action.type)}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
