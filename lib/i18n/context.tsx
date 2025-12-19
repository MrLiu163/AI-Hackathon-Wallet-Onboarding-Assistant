"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Locale } from "./translations"
import { getTranslations } from "./translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslations>
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [t, setT] = useState(() => getTranslations("en"))

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
      setLocaleState(savedLocale)
      setT(getTranslations(savedLocale))
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setT(getTranslations(newLocale))
    localStorage.setItem("locale", newLocale)
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
