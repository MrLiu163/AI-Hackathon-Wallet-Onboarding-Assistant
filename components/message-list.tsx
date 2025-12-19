"use client"

import type { Message } from "@/lib/schema"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface MessageListProps {
  messages: Message[]
}

function renderMarkdown(text: string) {
  // Split by lines for processing
  const lines = text.split("\n")
  const elements: JSX.Element[] = []

  lines.forEach((line, idx) => {
    // Handle bold text **text**
    let content: JSX.Element | string = line
    if (line.includes("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      content = (
        <>
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              )
            }
            return part
          })}
        </>
      )
    }

    // Handle URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g
    if (typeof content === "string" && urlRegex.test(content)) {
      const parts = content.split(urlRegex)
      content = (
        <>
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  {part}
                </a>
              )
            }
            return part
          })}
        </>
      )
    }

    // Render the line
    if (line.trim()) {
      elements.push(
        <div key={idx} className="leading-relaxed">
          {content}
        </div>,
      )
    } else if (idx > 0 && idx < lines.length - 1) {
      // Empty line = paragraph break
      elements.push(<div key={idx} className="h-2" />)
    }
  })

  return elements
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-3",
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            )}
          >
            <div className="break-words text-sm">{renderMarkdown(message.content)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
