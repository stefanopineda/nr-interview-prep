import Link from "next/link"
import { VOICE_PROBLEMS } from "@/lib/voice/problems"

export const metadata = { title: "Voice Interview POC — NR Prep" }

export default function VoiceDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <Link href="/interview" className="text-xs text-slate-400 hover:text-slate-200">
          ← back to interview prep
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Voice Interview (POC)</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Pick a problem. The AI will read it aloud, you draw on the whiteboard, then
          record a verbal explanation. You&apos;ll get spoken feedback graded on
          conciseness, understanding, clarity, and presenting skills.
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <ul className="space-y-3">
          {VOICE_PROBLEMS.map((p) => (
            <li key={p.id}>
              <Link
                href={`/voice/session/${p.id}`}
                className="block rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 transition hover:border-blue-500"
              >
                <div className="text-xs uppercase tracking-wide text-blue-400">
                  {p.topic}
                </div>
                <div className="mt-1 text-sm text-slate-200">{p.prompt}</div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
