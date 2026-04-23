"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SessionWorkspace from "@/components/interview/session-workspace"
import {
  getProblem,
  getSession,
  migrateLegacyPhases,
} from "@/lib/interview/session-store"
import type { PartSummary, Problem, SessionPhase } from "@/lib/interview/types"

interface LoadedState {
  problem: Problem
  phase: SessionPhase
  currentPartIndex: number | null
  partSummaries: PartSummary[] | null
}

export default function SessionPage({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [state, setState] = useState<LoadedState | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    migrateLegacyPhases()
    const session = getSession(sessionId)
    if (!session) {
      setNotFound(true)
      return
    }
    const problem = getProblem(session.problem_id)
    if (!problem) {
      setNotFound(true)
      return
    }
    setState({
      problem,
      phase: session.phase || "ttfp",
      currentPartIndex: session.current_part_index,
      partSummaries: session.part_summaries,
    })
  }, [sessionId])

  function handleSessionComplete() {
    router.push("/interview")
  }

  if (notFound) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-300">
        <div className="text-center">
          <p className="mb-3">Session not found or no longer available.</p>
          <button
            onClick={() => router.push("/interview")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading session…
      </div>
    )
  }

  return (
    <SessionWorkspace
      sessionId={sessionId}
      problem={state.problem}
      initialPhase={state.phase}
      initialCurrentPartIndex={state.currentPartIndex}
      initialPartSummaries={state.partSummaries}
      onSessionComplete={handleSessionComplete}
    />
  )
}
