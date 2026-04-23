"use client"

import { useState, useEffect, useRef } from "react"
import { getRandomFunFact } from "@/lib/interview/fun-facts"

interface FunFactProps {
  /** Show the fun fact banner */
  visible: boolean
}

export default function FunFact({ visible }: FunFactProps) {
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
