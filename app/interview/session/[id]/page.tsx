import SessionPage from "./session-page"

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SessionPage sessionId={id} />
}
