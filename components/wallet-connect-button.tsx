"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, LogOut, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"
import { useState } from "react"

function WalletLogo({ walletName }: { walletName: string }) {
  const size = 32

  if (walletName === "imToken") {
    return <img src="/images/400x400ia-imtoken.webp" alt="imToken" width={size} height={size} className="rounded-lg" />
  }

  if (walletName === "MetaMask") {
    return (
      <img src="/images/400x400ia-metamask.webp" alt="MetaMask" width={size} height={size} className="rounded-lg" />
    )
  }

  if (walletName === "Rabby Wallet") {
    return (
      <img
        src="/images/400x400ia-rabby-20wallet.webp"
        alt="Rabby Wallet"
        width={size}
        height={size}
        className="rounded-lg"
      />
    )
  }

  if (walletName === "WalletConnect") {
    return (
      <img src="/images/walletconnect-logo.png" alt="WalletConnect" width={size} height={size} className="rounded-lg" />
    )
  }

  return <Wallet className="h-8 w-8" />
}

const WALLET_LIST = [
  { id: "imtoken", name: "imToken" },
  { id: "metamask", name: "MetaMask" },
  { id: "rabby", name: "Rabby Wallet" },
  { id: "walletconnect", name: "WalletConnect" },
] as const

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: t.locale === "zh" ? "地址已复制" : "Address copied",
        description: t.locale === "zh" ? "钱包地址已复制到剪贴板" : "Wallet address copied to clipboard",
      })
    }
  }

  const handleConnect = (walletId: string) => {
    console.log("[v0] Connecting to wallet:", walletId)

    setIsOpen(false)

    if (walletId === "walletconnect") {
      toast({
        title: t.locale === "zh" ? "WalletConnect 不可用" : "WalletConnect Unavailable",
        description:
          t.locale === "zh"
            ? "WalletConnect 需要额外配置，请使用浏览器扩展钱包"
            : "WalletConnect requires additional setup. Please use a browser extension wallet.",
      })
      return
    }

    const injectedConnector = connectors.find((c) => c.id === "injected" || c.type === "injected")
    if (injectedConnector) {
      console.log("[v0] Found injected connector")
      try {
        connect({ connector: injectedConnector })
      } catch (error) {
        console.error("[v0] Connection error:", error)
        const walletName = WALLET_LIST.find((w) => w.id === walletId)?.name || "Wallet"
        toast({
          title: t.locale === "zh" ? "连接失败" : "Connection failed",
          description: t.locale === "zh" ? `请安装 ${walletName} 或重试` : `Please install ${walletName} or try again`,
          variant: "destructive",
        })
      }
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            {t.locale === "zh" ? "复制地址" : "Copy Address"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            {t.disconnect}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          {t.connectWallet}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[240px] p-0">
        <div className="flex flex-col">
          {WALLET_LIST.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-accent transition-colors cursor-pointer border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <WalletLogo walletName={wallet.name} />
                <span className="text-sm font-medium">{wallet.name}</span>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
