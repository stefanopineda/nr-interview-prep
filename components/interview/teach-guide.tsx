"use client"

import { type ReactNode, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from "lucide-react"
import {
  SECTION_LABELS,
  SECTION_ORDER,
  TEACH_CONTENT,
  TOTAL_SEGMENTS,
  type TeachSection,
  type TeachSegment,
} from "@/lib/interview/teach-content"
import { MarkdownWithMath } from "@/components/interview/markdown-with-math"
import { TeachDiagram } from "@/components/interview/teach-diagrams"

const STORAGE_KEY_SELECTED = "nupoc_teach_selected"
const STORAGE_KEY_EXPANDED = "nupoc_teach_expanded"

type SelectedRef = { section: TeachSection; segmentId: string }

const DEFAULT_SELECTION: SelectedRef = {
  section: SECTION_ORDER[0],
  segmentId: TEACH_CONTENT[SECTION_ORDER[0]][0].id,
}

function findSegment(ref: SelectedRef): TeachSegment | null {
  const list = TEACH_CONTENT[ref.section]
  return list.find((s) => s.id === ref.segmentId) ?? null
}

export function TeachGuide() {
  const [expanded, setExpanded] = useState<Record<TeachSection, boolean>>(() => ({
    calc1: true,
    calc2: false,
    phys1: false,
    phys2: false,
  }))
  const [selected, setSelected] = useState<SelectedRef>(DEFAULT_SELECTION)
  const [hydrated, setHydrated] = useState(false)
  const [readMoreOpen, setReadMoreOpen] = useState(false)
  const [examplesOpen, setExamplesOpen] = useState(false)

  // Reset the two CTA expandables whenever the selected segment changes.
  // Rationale (per spec §6.3): every new segment should present its tight
  // front matter first; carrying "last expanded" state across segments
  // defeats the glaze-first UX.
  useEffect(() => {
    setReadMoreOpen(false)
    setExamplesOpen(false)
  }, [selected.section, selected.segmentId])

  useEffect(() => {
    try {
      const rawSel = sessionStorage.getItem(STORAGE_KEY_SELECTED)
      if (rawSel) {
        const parsed = JSON.parse(rawSel) as SelectedRef
        if (findSegment(parsed)) {
          setSelected(parsed)
        }
      }
      const rawExp = sessionStorage.getItem(STORAGE_KEY_EXPANDED)
      if (rawExp) {
        const parsed = JSON.parse(rawExp) as Record<TeachSection, boolean>
        setExpanded((prev) => ({ ...prev, ...parsed }))
      } else {
        // First visit: expand the section containing the default selection.
        setExpanded((prev) => ({ ...prev, [DEFAULT_SELECTION.section]: true }))
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(selected))
    } catch {
      /* ignore */
    }
  }, [selected, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(expanded))
    } catch {
      /* ignore */
    }
  }, [expanded, hydrated])

  const currentSegment = useMemo(() => findSegment(selected), [selected])
  const currentSectionIndex = useMemo(
    () => SECTION_ORDER.indexOf(selected.section),
    [selected],
  )
  const currentSegmentList = TEACH_CONTENT[selected.section]
  const currentSegmentIndex = useMemo(
    () => currentSegmentList.findIndex((s) => s.id === selected.segmentId),
    [currentSegmentList, selected.segmentId],
  )

  function handleSelectSegment(section: TeachSection, segmentId: string) {
    setSelected({ section, segmentId })
    setExpanded((prev) => ({ ...prev, [section]: true }))
  }

  function handleToggleSection(section: TeachSection) {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  function goPrev() {
    if (currentSegmentIndex > 0) {
      const prev = currentSegmentList[currentSegmentIndex - 1]
      handleSelectSegment(selected.section, prev.id)
      return
    }
    if (currentSectionIndex > 0) {
      const prevSection = SECTION_ORDER[currentSectionIndex - 1]
      const prevList = TEACH_CONTENT[prevSection]
      const last = prevList[prevList.length - 1]
      handleSelectSegment(prevSection, last.id)
    }
  }

  function goNext() {
    if (currentSegmentIndex < currentSegmentList.length - 1) {
      const next = currentSegmentList[currentSegmentIndex + 1]
      handleSelectSegment(selected.section, next.id)
      return
    }
    if (currentSectionIndex < SECTION_ORDER.length - 1) {
      const nextSection = SECTION_ORDER[currentSectionIndex + 1]
      const first = TEACH_CONTENT[nextSection][0]
      handleSelectSegment(nextSection, first.id)
    }
  }

  const atFirst = currentSectionIndex === 0 && currentSegmentIndex === 0
  const lastSection = SECTION_ORDER[SECTION_ORDER.length - 1]
  const atLast =
    selected.section === lastSection &&
    currentSegmentIndex === TEACH_CONTENT[lastSection].length - 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
          <BookOpen className="h-4 w-4" />
          <span className="uppercase tracking-wider font-medium">Study Guide</span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Key Concepts &mdash; NUPOC Interview Prep
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl">
          A concise equation sheet with plain-English context for every topic on the
          Naval Reactors study list. Use it to refresh before you start solving
          problems. <span className="text-slate-300">Engineering approximations</span>{" "}
          (<span className="font-mono text-slate-300">g &asymp; 10</span>,{" "}
          <span className="font-mono text-slate-300">&pi; &asymp; 3</span>,{" "}
          <span className="font-mono text-slate-300">sin &theta; &asymp; &theta;</span>)
          are always accepted &mdash; precision of reasoning matters more than
          precision of arithmetic.
        </p>
        <p className="text-slate-500 text-xs mt-2">
          {TOTAL_SEGMENTS} topics across {SECTION_ORDER.length} sections.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* ─── Sidebar ─── */}
        <aside className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 h-fit md:sticky md:top-4">
          <nav>
            <ul className="space-y-1">
              {SECTION_ORDER.map((section) => {
                const isOpen = expanded[section]
                const segments = TEACH_CONTENT[section]
                return (
                  <li key={section}>
                    <button
                      type="button"
                      onClick={() => handleToggleSection(section)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left text-sm font-medium text-slate-200 hover:bg-[#334155]/60 transition-colors"
                    >
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span>{SECTION_LABELS[section]}</span>
                      <span className="ml-auto text-[10px] text-slate-500 font-normal">
                        {segments.length}
                      </span>
                    </button>
                    {isOpen && (
                      <ul className="mt-0.5 ml-5 border-l border-[#334155] pl-2 space-y-0.5">
                        {segments.map((seg) => {
                          const isActive =
                            selected.section === section && selected.segmentId === seg.id
                          return (
                            <li key={seg.id}>
                              <button
                                type="button"
                                onClick={() => handleSelectSegment(section, seg.id)}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                                  isActive
                                    ? "bg-blue-600/20 text-blue-300 border-l-2 border-blue-400 -ml-[2px] pl-[calc(0.5rem-2px)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-[#334155]/40"
                                }`}
                              >
                                {seg.title}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-4 pt-3 border-t border-[#334155]">
            <Link
              href="/interview"
              className="block w-full text-center text-xs text-blue-400 hover:text-blue-300 py-2"
            >
              &rarr; Back to Interview Prep
            </Link>
          </div>
        </aside>

        {/* ─── Content pane ─── */}
        <section>
          {currentSegment ? (
            <article className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 md:p-8">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-medium mb-2">
                {SECTION_LABELS[selected.section]}
              </div>
              <h2 className="text-2xl font-bold text-white mb-5">
                {currentSegment.title}
              </h2>

              {/* Front-matter diagram (when the diagram IS the concept). */}
              {currentSegment.diagramKey &&
                (currentSegment.diagramPlacement ?? "front") === "front" && (
                  <div className="rounded-lg bg-[#0f172a] border border-[#334155] p-4 md:p-5 mb-5">
                    <TeachDiagram diagramKey={currentSegment.diagramKey} />
                  </div>
                )}

              <div className="rounded-lg bg-[#0f172a] border border-[#334155] p-4 md:p-5 mb-5 overflow-x-auto">
                <MarkdownWithMath className="text-slate-100">
                  {currentSegment.keyEquations}
                </MarkdownWithMath>
              </div>

              <div className="text-slate-300 leading-relaxed">
                <MarkdownWithMath>{currentSegment.context}</MarkdownWithMath>
              </div>

              {/* Deep-dive CTAs — collapsed by default. */}
              {(currentSegment.readMore || currentSegment.exampleProblems) && (
                <div className="mt-6 space-y-3">
                  {currentSegment.readMore && (
                    <DeepDiveCta
                      id={`readmore-${currentSegment.id}`}
                      open={readMoreOpen}
                      onToggle={() => setReadMoreOpen((v) => !v)}
                      icon={<BookOpenText className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />}
                      heading="Not confident on the fundamentals?"
                      caption="Open the derivation & intuition — where this equation comes from, edge-case sanity checks, and when it breaks."
                      accent="blue"
                    >
                      {currentSegment.diagramKey &&
                        currentSegment.diagramPlacement === "readMore" && (
                          <div className="mb-4 rounded-lg bg-[#1e293b] border border-[#334155] p-3">
                            <TeachDiagram diagramKey={currentSegment.diagramKey} />
                          </div>
                        )}
                      <MarkdownWithMath className="text-slate-200">
                        {currentSegment.readMore}
                      </MarkdownWithMath>
                    </DeepDiveCta>
                  )}

                  {currentSegment.exampleProblems && (
                    <DeepDiveCta
                      id={`examples-${currentSegment.id}`}
                      open={examplesOpen}
                      onToggle={() => setExamplesOpen((v) => !v)}
                      icon={<Lightbulb className="h-5 w-5 text-amber-300 mt-0.5 flex-shrink-0" />}
                      heading="Want to see how this gets asked?"
                      caption="See example problems — a forward and reverse variant of the interview prompt, with the cue for which equation to reach for."
                      accent="amber"
                    >
                      <MarkdownWithMath className="text-slate-200">
                        {currentSegment.exampleProblems}
                      </MarkdownWithMath>
                    </DeepDiveCta>
                  )}
                </div>
              )}

              {currentSegment.practiceLink && (
                <div className="mt-6 pt-5 border-t border-[#334155]">
                  <Link
                    href="/interview"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300"
                  >
                    &rarr; Practice {currentSegment.practiceLink.subtopic} problems
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1">
                    (Sign in required to attempt problems.)
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={atFirst}
                  className="text-sm px-3 py-1.5 rounded-md bg-[#0f172a] border border-[#334155] text-slate-300 hover:bg-[#334155] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  &larr; Previous
                </button>
                <span className="text-xs text-slate-500">
                  {currentSegmentIndex + 1} / {currentSegmentList.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={atLast}
                  className="text-sm px-3 py-1.5 rounded-md bg-[#0f172a] border border-[#334155] text-slate-300 hover:bg-[#334155] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            </article>
          ) : (
            <div className="text-slate-400 text-center py-16">
              Select a topic from the sidebar to begin.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

type DeepDiveCtaProps = {
  id: string
  open: boolean
  onToggle: () => void
  icon: ReactNode
  heading: string
  caption: string
  accent: "blue" | "amber"
  children: ReactNode
}

function DeepDiveCta({
  id,
  open,
  onToggle,
  icon,
  heading,
  caption,
  accent,
  children,
}: DeepDiveCtaProps) {
  const accentClasses =
    accent === "blue"
      ? {
          border: open ? "border-blue-500/50" : "border-[#334155] hover:border-blue-500/40",
          bg: open ? "bg-blue-500/5" : "bg-[#0f172a] hover:bg-[#0f172a]/80",
          heading: "text-blue-200",
          chevron: "text-blue-300",
        }
      : {
          border: open ? "border-amber-500/50" : "border-[#334155] hover:border-amber-500/40",
          bg: open ? "bg-amber-500/5" : "bg-[#0f172a] hover:bg-[#0f172a]/80",
          heading: "text-amber-200",
          chevron: "text-amber-300",
        }
  const regionId = `${id}-region`
  return (
    <div className={`rounded-lg border ${accentClasses.border} ${accentClasses.bg} transition-colors`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={regionId}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        {icon}
        <span className="flex-1 min-w-0">
          <span className={`block text-sm font-semibold ${accentClasses.heading}`}>
            {heading}
          </span>
          <span className="block text-xs text-slate-400 mt-0.5 leading-relaxed">
            {caption}
          </span>
        </span>
        {open ? (
          <ChevronDown className={`h-5 w-5 ${accentClasses.chevron} flex-shrink-0 mt-0.5`} />
        ) : (
          <ChevronRight className={`h-5 w-5 ${accentClasses.chevron} flex-shrink-0 mt-0.5`} />
        )}
      </button>
      {open && (
        <div
          id={regionId}
          className="px-4 pb-4 pt-1 border-t border-[#334155]/60 mt-1"
        >
          {children}
        </div>
      )}
    </div>
  )
}
