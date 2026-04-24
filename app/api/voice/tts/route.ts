import { NextRequest, NextResponse } from "next/server"
import { xaiTTS } from "@/lib/voice/xai"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = (await req.json()) as { text?: string; voice?: string }
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 })
    }
    if (text.length > 4000) {
      return NextResponse.json({ error: "text too long" }, { status: 400 })
    }
    const audio = await xaiTTS(text, voice)
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "tts failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
