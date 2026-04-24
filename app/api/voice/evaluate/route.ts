import { NextRequest, NextResponse } from "next/server"
import { xaiSTT, xaiGrade, xaiTTS } from "@/lib/voice/xai"
import { getVoiceProblem } from "@/lib/voice/problems"

export const runtime = "nodejs"
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const problemId = String(form.get("problem_id") ?? "")
    const whiteboard = String(form.get("whiteboard") ?? "")
    const audio = form.get("audio")

    const problem = getVoiceProblem(problemId)
    if (!problem) return NextResponse.json({ error: "unknown problem" }, { status: 400 })
    if (!whiteboard.startsWith("data:image/")) {
      return NextResponse.json({ error: "whiteboard image missing" }, { status: 400 })
    }
    if (!(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json({ error: "audio missing" }, { status: 400 })
    }

    const mime = audio.type || "audio/webm"
    const transcript = await xaiSTT(audio, mime)

    const graded = await xaiGrade({
      problem_prompt: problem.prompt,
      reference_solution: problem.reference_solution,
      transcript,
      whiteboard_image_base64: whiteboard,
    })

    let spokenAudio: string | null = null
    try {
      const buf = await xaiTTS(graded.spoken_summary, "ara")
      spokenAudio =
        "data:audio/mpeg;base64," + Buffer.from(buf).toString("base64")
    } catch {
      // Non-fatal — client will still render the written feedback.
    }

    return NextResponse.json({
      transcript,
      ...graded,
      feedback_audio: spokenAudio,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "evaluate failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
