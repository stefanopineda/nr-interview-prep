const XAI_BASE = "https://api.x.ai/v1"

function getKey(): string {
  const key = process.env.XAI_API_KEY
  if (!key) throw new Error("XAI_API_KEY is not set")
  return key
}

export async function xaiTTS(text: string, voice = "eve"): Promise<ArrayBuffer> {
  const res = await fetch(`${XAI_BASE}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify({
      text,
      voice_id: voice,
      language: "en",
    }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(`xAI TTS failed (${res.status}): ${msg.slice(0, 300)}`)
  }
  return res.arrayBuffer()
}

export async function xaiSTT(audio: Blob, mime: string): Promise<string> {
  const form = new FormData()
  form.append("language", "en")
  form.append("format", "true")
  form.append("file", audio, filenameForMime(mime))

  const res = await fetch(`${XAI_BASE}/stt`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getKey()}` },
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(`xAI STT failed (${res.status}): ${msg.slice(0, 300)}`)
  }
  const data = (await res.json()) as { text?: string; transcript?: string }
  return (data.text ?? data.transcript ?? "").trim()
}

function filenameForMime(mime: string): string {
  if (mime.includes("webm")) return "audio.webm"
  if (mime.includes("ogg")) return "audio.ogg"
  if (mime.includes("mp4")) return "audio.mp4"
  if (mime.includes("wav")) return "audio.wav"
  if (mime.includes("mpeg")) return "audio.mp3"
  return "audio.bin"
}

export interface VoiceFeedback {
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
}

interface GradeArgs {
  problem_prompt: string
  reference_solution: string
  transcript: string
  whiteboard_image_base64: string
}

const GRADE_SYSTEM = `You are a tough but fair Naval Reactors interviewer evaluating an NUPOC candidate.

You receive:
  - the problem prompt
  - a reference solution (truth)
  - a photo of the candidate's whiteboard work
  - a transcript of the candidate's verbal explanation

Grade the candidate on four dimensions (1-5 integer, 3 = solid, 5 = outstanding):
  - conciseness: no rambling, gets to the point
  - understanding: correctness of physics reasoning and final answer
  - clarity: logical structure of the explanation
  - speaking: confidence, pace, filler-word discipline

Then list up to 3 short strengths, pick ONE single most important improvement, and write a 2-3 sentence spoken summary an interviewer would deliver aloud.

Return ONLY JSON matching this schema, no prose outside JSON:
{
  "scores": {"conciseness": int, "understanding": int, "clarity": int, "speaking": int},
  "strengths": [string],
  "key_improvement": string,
  "spoken_summary": string
}`

export async function xaiGrade(args: GradeArgs): Promise<Omit<VoiceFeedback, "transcript">> {
  const userText = `PROBLEM:\n${args.problem_prompt}\n\nREFERENCE SOLUTION:\n${args.reference_solution}\n\nCANDIDATE TRANSCRIPT:\n${args.transcript || "(no speech detected)"}`

  const res = await fetch(`${XAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify({
      model: "grok-4-latest",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: GRADE_SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: args.whiteboard_image_base64 } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(`xAI grade failed (${res.status}): ${msg.slice(0, 400)}`)
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content ?? ""
  const parsed = JSON.parse(content) as Omit<VoiceFeedback, "transcript">

  const clamp = (n: unknown) =>
    Math.max(1, Math.min(5, Math.round(Number(n) || 0)))
  return {
    scores: {
      conciseness: clamp(parsed.scores?.conciseness),
      understanding: clamp(parsed.scores?.understanding),
      clarity: clamp(parsed.scores?.clarity),
      speaking: clamp(parsed.scores?.speaking),
    },
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
    key_improvement: String(parsed.key_improvement ?? ""),
    spoken_summary: String(parsed.spoken_summary ?? ""),
  }
}
