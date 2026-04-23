"use client"

import { useRef, useState, useEffect, useCallback } from "react"

interface Stroke {
  points: { x: number; y: number }[]
  color: string
  size: number
}

interface WhiteboardProps {
  onExport: (base64: string) => void
  disabled?: boolean
  disabledReason?: string
  /** Parent increments this counter to request a canvas clear (e.g., after a capstone part completes). */
  clearSignal?: number
}

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
]
const PEN_SIZES = [2, 4, 8]

export default function Whiteboard({ onExport, disabled, disabledReason, clearSignal }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [color, setColor] = useState("#000000")
  const [penSize, setPenSize] = useState(4)

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      redraw(strokes)
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // LocalStorage backup every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (strokes.length > 0) {
        localStorage.setItem("whiteboard_backup", JSON.stringify(strokes))
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [strokes])

  // Restore from backup on mount
  useEffect(() => {
    const backup = localStorage.getItem("whiteboard_backup")
    if (backup) {
      try {
        const restored = JSON.parse(backup) as Stroke[]
        setStrokes(restored)
        redraw(restored)
      } catch {
        // Ignore corrupt backup
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const redraw = useCallback(
    (strokeList: Stroke[]) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // White background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const stroke of strokeList) {
        if (stroke.points.length < 2) continue
        ctx.beginPath()
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
        }
        ctx.stroke()
      }
    },
    [],
  )

  // Re-render whenever strokes change
  useEffect(() => {
    redraw(strokes)
  }, [strokes, redraw])

  function getPoint(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      const touch = e.touches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    if (disabled) return
    e.preventDefault()
    const point = getPoint(e)
    const stroke: Stroke = {
      points: [point],
      color: tool === "eraser" ? "#ffffff" : color,
      size: tool === "eraser" ? 20 : penSize,
    }
    setCurrentStroke(stroke)
    setIsDrawing(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || !currentStroke || disabled) return
    e.preventDefault()
    const point = getPoint(e)
    const updated = {
      ...currentStroke,
      points: [...currentStroke.points, point],
    }
    setCurrentStroke(updated)

    // Draw incrementally for performance
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && currentStroke.points.length > 0) {
      const prev = currentStroke.points[currentStroke.points.length - 1]
      ctx.beginPath()
      ctx.strokeStyle = updated.color
      ctx.lineWidth = updated.size
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }

  function endDraw() {
    if (!isDrawing || !currentStroke) return
    setStrokes((prev) => [...prev, currentStroke])
    setCurrentStroke(null)
    setIsDrawing(false)
  }

  function undo() {
    setStrokes((prev) => prev.slice(0, -1))
  }

  function clearCanvas() {
    setStrokes([])
    localStorage.removeItem("whiteboard_backup")
  }

  // Clear when the parent bumps clearSignal (capstone part advance).
  useEffect(() => {
    if (clearSignal === undefined || clearSignal === 0) return
    setStrokes([])
    localStorage.removeItem("whiteboard_backup")
  }, [clearSignal])

  function exportCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return

    // Client-side compression: export as JPEG at 70% quality
    // Downscale if too large
    const maxDim = 1024
    let exportCanvas = canvas

    if (canvas.width > maxDim || canvas.height > maxDim) {
      const scale = Math.min(maxDim / canvas.width, maxDim / canvas.height)
      const offscreen = document.createElement("canvas")
      offscreen.width = Math.round(canvas.width * scale)
      offscreen.height = Math.round(canvas.height * scale)
      const ctx = offscreen.getContext("2d")
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height)
        exportCanvas = offscreen
      }
    }

    const base64 = exportCanvas.toDataURL("image/jpeg", 0.7)
    onExport(base64)
  }

  // Check if canvas has meaningful content
  function hasContent(): boolean {
    return strokes.length > 0
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#1e293b] border-b border-[#334155] flex-wrap">
        {/* Tool selection */}
        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tool === "pen"
              ? "bg-blue-600 text-white"
              : "bg-[#334155] text-slate-300 hover:bg-[#475569]"
          }`}
        >
          Pen
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            tool === "eraser"
              ? "bg-blue-600 text-white"
              : "bg-[#334155] text-slate-300 hover:bg-[#475569]"
          }`}
        >
          Eraser
        </button>

        <div className="w-px h-6 bg-[#475569]" />

        {/* Colors */}
        {COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => { setColor(c.value); setTool("pen") }}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              color === c.value && tool === "pen"
                ? "border-blue-400 scale-110"
                : "border-[#475569]"
            }`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}

        <div className="w-px h-6 bg-[#475569]" />

        {/* Pen sizes */}
        {PEN_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setPenSize(size)}
            className={`flex items-center justify-center w-8 h-8 rounded transition-colors ${
              penSize === size && tool === "pen"
                ? "bg-blue-600/30 border border-blue-500"
                : "bg-[#334155] hover:bg-[#475569]"
            }`}
          >
            <div
              className="rounded-full bg-white"
              style={{ width: size + 2, height: size + 2 }}
            />
          </button>
        ))}

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={undo}
          disabled={strokes.length === 0}
          className="px-3 py-1.5 rounded text-sm text-slate-300 bg-[#334155] hover:bg-[#475569] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={clearCanvas}
          disabled={strokes.length === 0}
          className="px-3 py-1.5 rounded text-sm text-red-400 bg-[#334155] hover:bg-red-900/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          onClick={exportCanvas}
          disabled={disabled || !hasContent()}
          className="px-4 py-1.5 rounded text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit Whiteboard
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 bg-white cursor-crosshair relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="absolute inset-0 touch-none"
        />
        {disabled && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-6">
            <div className="bg-white/90 border border-slate-300 rounded-lg px-5 py-4 max-w-sm text-center shadow-lg">
              <div className="text-slate-700 text-sm font-medium">Whiteboard locked</div>
              <div className="text-slate-500 text-xs mt-1">
                {disabledReason || "Complete the current step to unlock the whiteboard."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
