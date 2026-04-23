"use client"

import { useState, useEffect, useRef } from "react"
import { getRandomFunFact } from "@/lib/interview/fun-facts"

interface FunFactProps {
  visible: boolean
  variant?: "inline" | "overlay"
}

export default function FunFact({ visible, variant = "inline" }: FunFactProps) {
  const [fact, setFact] = useState("")
  const shownIndices = useRef(new Set<number>())

  useEffect(() => {
    if (visible) {
      const { fact: newFact, index } = getRandomFunFact(shownIndices.current)
      shownIndices.current.add(index)
      setFact(newFact)
    }
  }, [visible])

  if (!visible || !fact) return null

  if (variant === "overlay") {
    return (
      <div
        className="absolute inset-0 z-30 flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-sm p-6 animate-in fade-in duration-200"
        role="status"
        aria-live="polite"
      >
        <div className="w-full max-w-md bg-[#1e293b] border border-blue-500/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
              Evaluating — did you know?
            </span>
          </div>
          <p className="text-slate-200 text-base leading-relaxed">{fact}</p>
          <div className="mt-4 pt-3 border-t border-[#334155] text-[11px] text-slate-500">
            Tap the Whiteboard tab below to keep working while I think.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 mx-4 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-2">
        <span className="text-blue-400 text-sm shrink-0 mt-0.5">&#x2699;</span>
        <div>
          <div className="text-xs text-blue-400 font-medium mb-0.5">Did you know?</div>
          <p className="text-slate-400 text-xs leading-relaxed">{fact}</p>
        </div>
      </div>
    </div>
  )
}
