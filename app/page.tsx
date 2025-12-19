"use client"
import { ChatPanel } from "@/components/chat-panel"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Providers } from "@/components/providers"
import { I18nProvider, useI18n } from "@/lib/i18n/context"

function PageContent() {
  const { t } = useI18n()

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">{t.appName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ChatPanel />
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Providers>
      <I18nProvider>
        <PageContent />
      </I18nProvider>
    </Providers>
  )
}
