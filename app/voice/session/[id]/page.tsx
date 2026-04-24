import Link from "next/link"
import { notFound } from "next/navigation"
import { getVoiceProblem } from "@/lib/voice/problems"
import VoiceSession from "@/components/voice/voice-session"

export default async function VoiceSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const problem = getVoiceProblem(id)
  if (!problem) notFound()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-3">
        <Link href="/voice" className="text-xs text-slate-400 hover:text-slate-200">
          ← back to problems
        </Link>
      </header>
      <VoiceSession problem={problem} />
    </div>
  )
}
