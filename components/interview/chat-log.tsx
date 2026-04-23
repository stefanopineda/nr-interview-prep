"use client"

import { useEffect, useRef } from "react"
import { MarkdownWithMath } from "@/components/interview/markdown-with-math"

export interface ChatMessage {
  role: "user" | "tutor"
  content: string
  timestamp?: string
}

interface ChatLogProps {
  messages: ChatMessage[]
  streamingContent?: string
}

export default function ChatLog({ messages, streamingContent }: ChatLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages or streaming content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-3 p-4"
    >
      {messages.length === 0 && !streamingContent && (
        <div className="text-slate-500 text-sm text-center py-8">
          Type your governing principle in the box below to begin. The interviewer will respond here.
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600/20 text-blue-100 border border-blue-500/30"
                : "bg-[#1e293b] text-slate-200 border border-[#334155]"
            }`}
          >
            {msg.role === "tutor" && (
              <div className="text-xs text-slate-500 mb-1 font-medium">NR Interviewer</div>
            )}
            {msg.role === "tutor" ? (
              <MarkdownWithMath>{msg.content}</MarkdownWithMath>
            ) : (
              <div className="whitespace-pre-wrap">{msg.content}</div>
            )}
          </div>
        </div>
      ))}

      {/* Streaming indicator */}
      {streamingContent && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed bg-[#1e293b] text-slate-200 border border-[#334155]">
            <div className="text-xs text-slate-500 mb-1 font-medium">NR Interviewer</div>
            <MarkdownWithMath>{streamingContent}</MarkdownWithMath>
            <span className="inline-block w-1.5 h-4 bg-blue-400 animate-pulse ml-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}
