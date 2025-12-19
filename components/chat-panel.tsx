"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { MessageList } from "@/components/message-list"
import { ActionButtons } from "@/components/action-buttons"
import { useToast } from "@/hooks/use-toast"
import type { Message, UIAction } from "@/lib/schema"
import { useI18n } from "@/lib/i18n/context"

export function ChatPanel() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentActions, setCurrentActions] = useState<UIAction[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, locale } = useI18n()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleWalletRequired = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    toast({
      title: t.connectWalletTitle,
      description: t.connectWalletDesc,
    })
  }

  const handleQuickAction = async (message: string) => {
    if (isLoading) return

    const userMessage: Message = {
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setCurrentActions([])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          address: address || null,
          locale: locale,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      console.log("[v0] Received API response:", data)

      const assistantMessage: Message = {
        role: "assistant",
        content: data.assistant_message || "I apologize, I couldn't process that request.",
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.actions && Array.isArray(data.actions)) {
        console.log("[v0] Setting actions:", data.actions)
        setCurrentActions(data.actions)
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      toast({
        title: t.errorTitle,
        description: t.chatError,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setCurrentActions([])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          address: address || null,
          locale: locale,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      console.log("[v0] Received API response:", data)

      const assistantMessage: Message = {
        role: "assistant",
        content: data.assistant_message || "I apologize, I couldn't process that request.",
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.actions && Array.isArray(data.actions)) {
        console.log("[v0] Setting actions:", data.actions)
        setCurrentActions(data.actions)
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      toast({
        title: t.errorTitle,
        description: t.chatError,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="container mx-auto max-w-3xl py-8">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-semibold">{t.welcomeTitle}</h2>
              <p className="text-muted-foreground mb-6">{t.welcomeSubtitle}</p>
              <div className="grid gap-2 text-left text-sm">
                <p className="text-muted-foreground">{t.tryPasting}</p>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() =>
                    handleQuickAction(
                      locale === "zh"
                        ? "我已收款，但无法找到正确账户"
                        : "I've received funds but can't find the right account",
                    )
                  }
                  disabled={isLoading}
                >
                  {t.pasteHashButton}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() =>
                    handleQuickAction(
                      locale === "zh" ? "如何安全获取 DeFi 收益？" : "How can I safely earn DeFi yields?",
                    )
                  }
                  disabled={isLoading}
                >
                  {t.defiQuestion}
                </Button>
                {address && (
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                    onClick={() =>
                      handleQuickAction(locale === "zh" ? "分析我的投资组合" : "Analyze my wallet portfolio")
                    }
                    disabled={isLoading}
                  >
                    {t.analyzeWallet}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() =>
                    handleQuickAction(locale === "zh" ? "导出我的交易记录" : "Export my transaction history")
                  }
                  disabled={isLoading}
                >
                  {t.exportTxRecords}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() =>
                    handleQuickAction(locale === "zh" ? "如何将 USDT 兑换为 ETH ？" : "How can I swap USDT into ETH?")
                  }
                  disabled={isLoading}
                >
                  {t.swapMyTokens}
                </Button>
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() =>
                    handleQuickAction(locale === "zh" ? "什么是以太坊 Interop ？" : "What is Ethereum Interop?")
                  }
                  disabled={isLoading}
                >
                  {t.faqAnswers}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {currentActions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">{t.quickActions}</p>
                  <ActionButtons actions={currentActions} onWalletRequired={handleWalletRequired} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={address ? t.placeholderConnected : t.placeholderDisconnected}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
