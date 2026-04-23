import type { ComponentType } from "react"
import { FbdInclinedPlane } from "./fbd-inclined-plane"
import { UnitCircle } from "./unit-circle"
import { FrustumSlant } from "./frustum-slant"
import type { DiagramKey } from "@/lib/interview/teach-content"

/**
 * Registry of every diagram the Teach Me guide can render.
 *
 * To add a new diagram:
 *   1. Create the SVG component in this directory (pure presentational, no state)
 *   2. Import and register it here
 *   3. Add its key to the `DiagramKey` union in `lib/interview/teach-content.ts`
 *   4. Reference it from a segment via `diagramKey: "your-new-key"`
 */
export const DIAGRAMS: Record<DiagramKey, ComponentType> = {
  "fbd-inclined-plane": FbdInclinedPlane,
  "unit-circle": UnitCircle,
  "frustum-slant": FrustumSlant,
}

export function TeachDiagram({ diagramKey }: { diagramKey: DiagramKey }) {
  const Component = DIAGRAMS[diagramKey]
  if (!Component) return null
  return <Component />
}
