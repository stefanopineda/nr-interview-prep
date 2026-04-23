import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NR Interview Prep | NUPOC",
  description: "Naval Reactors interview preparation simulator",
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {children}
    </div>
  )
}
