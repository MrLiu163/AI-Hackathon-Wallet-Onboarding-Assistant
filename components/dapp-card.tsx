"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

interface DAppCardProps {
  dapp: {
    id: string
    name: string
    category: string
    description: string
    features: string[]
    url: string
    risks: string
    bestFor: string[]
  }
  onOpen: () => void
}

export function DAppCard({ dapp, onOpen }: DAppCardProps) {
  const { t } = useI18n()

  const getCategoryColor = (category: string) => {
    const colors = {
      dex: "bg-blue-500/10 text-blue-500",
      lending: "bg-green-500/10 text-green-500",
      bridge: "bg-purple-500/10 text-purple-500",
      yield: "bg-yellow-500/10 text-yellow-500",
      aggregator: "bg-pink-500/10 text-pink-500",
      stablecoin: "bg-cyan-500/10 text-cyan-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-500"
  }

  const getRiskColor = (risks: string) => {
    if (risks.toLowerCase().includes("low")) return "text-green-600 dark:text-green-400"
    if (risks.toLowerCase().includes("medium")) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{dapp.name}</CardTitle>
            <CardDescription className="mt-0.5 text-xs line-clamp-2">{dapp.description}</CardDescription>
          </div>
          <Badge variant="secondary" className={`${getCategoryColor(dapp.category)} text-xs shrink-0`}>
            {dapp.category.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pb-3 text-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium mb-1.5">
            <Sparkles className="h-3 w-3" />
            {t.features}
          </div>
          <div className="flex flex-wrap gap-1">
            {dapp.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0 px-1.5 h-5">
                {feature}
              </Badge>
            ))}
            {dapp.features.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                +{dapp.features.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium mb-1">
            <Shield className="h-3 w-3" />
            {t.risks}
          </div>
          <p className="text-xs text-muted-foreground">{dapp.risks}</p>
        </div>

        {dapp.bestFor && dapp.bestFor.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-1">{t.bestFor}</div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {dapp.bestFor.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5 text-xs">•</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={onOpen} size="sm" className="w-full gap-1.5 h-8 text-xs">
          <ExternalLink className="h-3 w-3" />
          Open {dapp.name}
        </Button>
      </CardFooter>
    </Card>
  )
}
