"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Whiteboard from "@/components/interview/whiteboard"
import type { VoiceProblem } from "@/lib/voice/problems"

type Stage = "idle" | "prompting" | "ready" | "recording" | "evaluating" | "done"

interface Feedback {
  transcript: string
  scores: {
    conciseness: number
    understanding: number
    clarity: number
    speaking: number
  }
  strengths: string[]
  key_improvement: string
  spoken_summary: string
  feedback_audio: string | null
}

export default function VoiceSession({ problem }: { problem: VoiceProblem }) {
  const [stage, setStage] = useState<Stage>("idle")
  const [error, setError] = useState<string | null>(null)
  const [whiteboardImage, setWhiteboardImage] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordStartRef = useRef<number>(0)
  const tickRef = useRef<number | null>(null)

  const speak = useCallback(async (text: string) => {
    const res = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: "eve" }),
    })
    if (!res.ok) throw new Error("tts failed")
    const buf = await res.arrayBuffer()
    const blob = new Blob([buf], { type: "audio/mpeg" })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audioRef.current = audio
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url)
        resolve()
      }
      audio.onerror = () => reject(new Error("audio playback failed"))
      audio.play().catch(reject)
    })
  }, [])

  const startPrompt = useCallback(async () => {
    setError(null)
    setFeedback(null)
    setWhiteboardImage(null)
    setStage("prompting")
    try {
      await speak(problem.spoken_prompt)
      setStage("ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to play prompt")
      setStage("idle")
    }
  }, [problem, speak])

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mime = pickMime()
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorderRef.current = rec
      rec.start()
      recordStartRef.current = Date.now()
      setElapsed(0)
      tickRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - recordStartRef.current) / 1000))
      }, 250)
      setStage("recording")
    } catch (err) {
      setError(
        err instanceof Error
          ? `Microphone blocked: ${err.message}`
          : "Microphone blocked",
      )
    }
  }, [])

  const stopRecordingAndEvaluate = useCallback(async () => {
    const rec = mediaRecorderRef.current
    if (!rec) return
    setStage("evaluating")
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }

    const audioBlob: Blob = await new Promise((resolve) => {
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        })
        resolve(blob)
      }
      rec.stop()
    })
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    if (!whiteboardImage) {
      setError("Draw and submit your whiteboard first.")
      setStage("ready")
      return
    }

    try {
      const form = new FormData()
      form.append("problem_id", problem.id)
      form.append("whiteboard", whiteboardImage)
      form.append("audio", audioBlob, "explanation.webm")
      const res = await fetch("/api/voice/evaluate", { method: "POST", body: form })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(j.error || `evaluate failed (${res.status})`)
      }
      const data = (await res.json()) as Feedback
      setFeedback(data)
      setStage("done")
      if (data.feedback_audio) {
        const audio = new Audio(data.feedback_audio)
        audio.play().catch(() => {
          /* autoplay block — user can click replay */
        })
        audioRef.current = audio
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed")
      setStage("ready")
    }
  }, [problem.id, whiteboardImage])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  const replayFeedback = useCallback(() => {
    if (!feedback?.feedback_audio) return
    const audio = new Audio(feedback.feedback_audio)
    audio.play().catch(() => {})
    audioRef.current = audio
  }, [feedback])

  return (
    <div className="grid h-[calc(100vh-49px)] grid-cols-1 md:grid-cols-[1fr_360px]">
      {/* Whiteboard */}
      <div className="flex flex-col border-r border-slate-800">
        <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-blue-400">
            {problem.topic}
          </div>
          <div className="mt-1 text-sm text-slate-200">{problem.prompt}</div>
        </div>
        <div className="flex-1">
          <Whiteboard
            onExport={(b64) => setWhiteboardImage(b64)}
            disabled={stage === "evaluating"}
          />
        </div>
      </div>

      {/* Control panel */}
      <aside className="flex flex-col gap-4 overflow-y-auto bg-slate-900 p-4">
        <section>
          <h2 className="text-sm font-semibold text-slate-200">1. Hear the problem</h2>
          <button
            onClick={startPrompt}
            disabled={stage === "prompting" || stage === "recording" || stage === "evaluating"}
            className="mt-2 w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            {stage === "prompting"
              ? "Playing…"
              : stage === "idle"
                ? "Play question"
                : "Replay question"}
          </button>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-200">2. Draw your solution</h2>
          <p className="mt-1 text-xs text-slate-400">
            Click <span className="font-medium text-slate-200">Submit Whiteboard</span>{" "}
            on the canvas when you&apos;re done.
          </p>
          <div className="mt-2 text-xs">
            {whiteboardImage ? (
              <span className="text-emerald-400">✓ Whiteboard captured</span>
            ) : (
              <span className="text-slate-500">Not yet captured</span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-200">3. Explain out loud</h2>
          {stage !== "recording" ? (
            <button
              onClick={startRecording}
              disabled={
                stage === "prompting" ||
                stage === "evaluating" ||
                !whiteboardImage
              }
              className="mt-2 w-full rounded bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-40"
            >
              ● Record explanation
            </button>
          ) : (
            <button
              onClick={stopRecordingAndEvaluate}
              className="mt-2 w-full rounded bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              ■ Stop &amp; submit ({elapsed}s)
            </button>
          )}
        </section>

        {error && (
          <div className="rounded border border-rose-800 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        )}

        {stage === "evaluating" && (
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-4 text-center text-sm text-slate-400">
            Grading your explanation…
          </div>
        )}

        {feedback && (
          <div className="space-y-3 rounded border border-slate-800 bg-slate-950 p-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Scores (1-5)</div>
              <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                <ScoreRow label="Conciseness" value={feedback.scores.conciseness} />
                <ScoreRow label="Understanding" value={feedback.scores.understanding} />
                <ScoreRow label="Clarity" value={feedback.scores.clarity} />
                <ScoreRow label="Speaking" value={feedback.scores.speaking} />
              </div>
            </div>

            {feedback.strengths.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-emerald-400">
                  What went well
                </div>
                <ul className="mt-1 list-inside list-disc text-xs text-slate-300">
                  {feedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="text-xs uppercase tracking-wide text-amber-400">
                Most important improvement
              </div>
              <p className="mt-1 text-xs text-slate-200">{feedback.key_improvement}</p>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Transcript</div>
              <p className="mt-1 text-xs italic text-slate-400">
                “{feedback.transcript || "(no speech detected)"}”
              </p>
            </div>

            {feedback.feedback_audio && (
              <button
                onClick={replayFeedback}
                className="w-full rounded bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
              >
                🔊 Replay spoken feedback
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded bg-slate-900 px-2 py-1">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono font-semibold text-slate-100">{value}/5</span>
    </div>
  )
}

function pickMime(): string | null {
  if (typeof MediaRecorder === "undefined") return null
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ]
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c
  }
  return null
}
