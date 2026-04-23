"use client"

import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { cn } from "@/lib/utils"

interface MarkdownWithMathProps {
  children: string
  className?: string
}

/**
 * Renders markdown text with LaTeX math via KaTeX.
 * Inline math: $...$  Block math: $$...$$
 *
 * Used for problem prompts, hints, and streamed AI responses.
 * Streamed content is safe: an unclosed $...$ stays as literal text
 * until the closing delimiter arrives, at which point the next render
 * swaps it for rendered math.
 */
export function MarkdownWithMath({ children, className }: MarkdownWithMathProps) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
