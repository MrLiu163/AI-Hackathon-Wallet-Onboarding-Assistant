"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "zh" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      title={locale === "en" ? "Switch to Chinese" : "切换到英文"}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute bottom-0 right-0 text-[10px] font-bold">{locale === "en" ? "EN" : "中"}</span>
    </Button>
  )
}
