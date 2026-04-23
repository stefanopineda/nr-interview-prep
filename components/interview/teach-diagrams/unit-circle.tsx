"use client"

import katex from "katex"

/**
 * Render a LaTeX string inside an SVG <foreignObject> via KaTeX.
 *
 * SVG <text> cannot produce real stacked fractions, radicals with vinculum,
 * or Greek — the Unicode fallbacks (⁄, √, π) render as shabby glyphs and
 * undermine trust in the figure. Routing all math through KaTeX fixes it.
 *
 * Positioning: `x, y` is the top-left of the foreignObject; `align` controls
 * horizontal alignment of the inline math within the box; vertical alignment
 * is always centered. Pick `width` generous enough that the rendered math
 * doesn't wrap (math stays on one line due to whiteSpace: nowrap).
 */
function TexLabel({
  x,
  y,
  width,
  height,
  children,
  fill = "#e2e8f0",
  fontSize = 12,
  fontWeight = 400,
  align = "start",
}: {
  x: number
  y: number
  width: number
  height: number
  children: string
  fill?: string
  fontSize?: number
  fontWeight?: number
  align?: "start" | "center" | "end"
}) {
  const justifyContent =
    align === "start" ? "flex-start" : align === "center" ? "center" : "flex-end"
  const html = katex.renderToString(children, {
    throwOnError: false,
    output: "html",
    displayMode: false,
  })
  return (
    <foreignObject x={x} y={y} width={width} height={height} style={{ overflow: "visible" }}>
      <div
        // @ts-expect-error xmlns is valid on HTML inside foreignObject
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          color: fill,
          fontSize: `${fontSize}px`,
          fontWeight,
          lineHeight: 1.2,
          display: "flex",
          justifyContent,
          alignItems: "center",
          height: "100%",
          whiteSpace: "nowrap",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </foreignObject>
  )
}

export function UnitCircle() {
  const axisColor = "#64748b"
  const geometryColor = "#94a3b8"
  const primaryColor = "#60a5fa"
  const accentColor = "#f59e0b"
  const labelColor = "#e2e8f0"
  const dimColor = "#cbd5e1"

  const cx = 130
  const cy = 150
  const r = 100

  const angles = [
    { deg: 0, cos: 1, sin: 0 },
    { deg: 30, cos: Math.sqrt(3) / 2, sin: 1 / 2 },
    { deg: 45, cos: Math.sqrt(2) / 2, sin: Math.sqrt(2) / 2 },
    { deg: 60, cos: 1 / 2, sin: Math.sqrt(3) / 2 },
    { deg: 90, cos: 0, sin: 1 },
  ]

  return (
    <svg
      viewBox="0 0 640 400"
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="Unit circle with Q1 angles in radians and degrees, paired with 30-60-90 and 45-45-90 reference triangles showing sine, cosine, and tangent values"
    >
      <defs>
        <marker
          id="uc-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={axisColor} />
        </marker>
      </defs>

      {/* ─── LEFT: Unit circle ─── */}
      <g>
        {/* Axes */}
        <line
          x1={cx - r - 20}
          y1={cy}
          x2={cx + r + 20}
          y2={cy}
          stroke={axisColor}
          strokeWidth="1"
          markerEnd="url(#uc-arrow)"
        />
        <line
          x1={cx}
          y1={cy + r + 20}
          x2={cx}
          y2={cy - r - 20}
          stroke={axisColor}
          strokeWidth="1"
          markerEnd="url(#uc-arrow)"
        />

        {/* Axis labels */}
        <TexLabel x={cx + r + 6} y={cy + 2} width={70} height={16} fill={axisColor} fontSize={10}>
          {String.raw`x = \cos\theta`}
        </TexLabel>
        <TexLabel x={cx + 4} y={cy - r - 20} width={70} height={16} fill={axisColor} fontSize={10}>
          {String.raw`y = \sin\theta`}
        </TexLabel>

        {/* Circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="rgba(148, 163, 184, 0.06)"
          stroke={geometryColor}
          strokeWidth="1.5"
        />

        {/* Radials + dots */}
        {angles.map((a) => {
          const x = cx + r * a.cos
          const y = cy - r * a.sin
          const isCardinal = a.deg === 0 || a.deg === 90
          return (
            <g key={a.deg}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={isCardinal ? axisColor : primaryColor}
                strokeWidth="1"
                strokeDasharray={isCardinal ? undefined : "3 2"}
                opacity={isCardinal ? 1 : 0.75}
              />
              <circle cx={x} cy={y} r="3" fill={accentColor} />
            </g>
          )
        })}

        {/* Angle labels (deg + rad), positioned just outside each arc endpoint */}
        <TexLabel x={cx + r + 6} y={cy - 8} width={70} height={18} fill={labelColor} fontSize={11}>
          {String.raw`0^\circ,\; 0`}
        </TexLabel>
        <TexLabel
          x={cx + r * 0.92}
          y={cy - r * 0.55 - 8}
          width={70}
          height={18}
          fill={labelColor}
          fontSize={11}
        >
          {String.raw`30^\circ,\; \tfrac{\pi}{6}`}
        </TexLabel>
        <TexLabel
          x={cx + r * 0.72}
          y={cy - r * 0.82 - 8}
          width={70}
          height={18}
          fill={labelColor}
          fontSize={11}
        >
          {String.raw`45^\circ,\; \tfrac{\pi}{4}`}
        </TexLabel>
        <TexLabel
          x={cx + r * 0.48}
          y={cy - r * 1.05 - 8}
          width={70}
          height={18}
          fill={labelColor}
          fontSize={11}
        >
          {String.raw`60^\circ,\; \tfrac{\pi}{3}`}
        </TexLabel>
        <TexLabel
          x={cx - 72}
          y={cy - r - 22}
          width={70}
          height={18}
          fill={labelColor}
          fontSize={11}
          align="end"
        >
          {String.raw`90^\circ,\; \tfrac{\pi}{2}`}
        </TexLabel>

        {/* Caption below */}
        <TexLabel
          x={cx - r}
          y={cy + r + 22}
          width={240}
          height={18}
          fill={dimColor}
          fontSize={10}
        >
          {String.raw`\text{point on circle} = (\cos\theta,\; \sin\theta)`}
        </TexLabel>
      </g>

      {/* ─── RIGHT TOP: 30-60-90 reference triangle ─── */}
      <g>
        <text x="290" y="50" fill={primaryColor} fontSize="11" fontWeight="600">
          30-60-90 triangle
        </text>

        {/* Triangle: 30° at (290, 170), 90° at (410, 170), 60° at (410, 101).
            Horizontal leg 120 ≈ √3 units, vertical leg 69 ≈ 1 unit, hypotenuse ≈ 2 units. */}
        <polygon
          points="290,170 410,170 410,101"
          fill="rgba(96, 165, 250, 0.08)"
          stroke={primaryColor}
          strokeWidth="1.5"
        />
        {/* Right-angle marker at (410, 170) */}
        <polyline points="403,170 403,163 410,163" fill="none" stroke={primaryColor} strokeWidth="1" />

        {/* Interior angle marks */}
        <TexLabel x={296} y={154} width={30} height={16} fill={labelColor} fontSize={11}>
          {String.raw`30^\circ`}
        </TexLabel>
        <TexLabel x={380} y={104} width={30} height={16} fill={labelColor} fontSize={11}>
          {String.raw`60^\circ`}
        </TexLabel>

        {/* Side labels */}
        {/* bottom leg (long, = √3) */}
        <TexLabel
          x={336}
          y={172}
          width={30}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
          align="center"
        >
          {String.raw`\sqrt{3}`}
        </TexLabel>
        {/* right leg (short, = 1) */}
        <TexLabel
          x={414}
          y={126}
          width={16}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
        >
          {String.raw`1`}
        </TexLabel>
        {/* hypotenuse (= 2), above-left of midpoint (350, 135) */}
        <TexLabel
          x={324}
          y={118}
          width={20}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
        >
          {String.raw`2`}
        </TexLabel>

        {/* Value lists to the right of the triangle */}
        <TexLabel
          x={450}
          y={62}
          width={120}
          height={18}
          fill={primaryColor}
          fontSize={12}
          fontWeight={600}
        >
          {String.raw`\text{at }30^\circ`}
        </TexLabel>
        <TexLabel x={450} y={82} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\sin 30^\circ = \tfrac{1}{2}`}
        </TexLabel>
        <TexLabel x={450} y={102} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\cos 30^\circ = \tfrac{\sqrt{3}}{2}`}
        </TexLabel>
        <TexLabel x={450} y={122} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\tan 30^\circ = \tfrac{1}{\sqrt{3}}`}
        </TexLabel>

        <TexLabel
          x={450}
          y={146}
          width={120}
          height={18}
          fill={primaryColor}
          fontSize={12}
          fontWeight={600}
        >
          {String.raw`\text{at }60^\circ`}
        </TexLabel>
        <TexLabel x={450} y={166} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\sin 60^\circ = \tfrac{\sqrt{3}}{2}`}
        </TexLabel>
        <TexLabel x={450} y={186} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\cos 60^\circ = \tfrac{1}{2}`}
        </TexLabel>
        <TexLabel x={450} y={206} width={150} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\tan 60^\circ = \sqrt{3}`}
        </TexLabel>
      </g>

      {/* ─── RIGHT BOTTOM: 45-45-90 reference triangle ─── */}
      <g>
        <text x="290" y="238" fill={primaryColor} fontSize="11" fontWeight="600">
          45-45-90 triangle
        </text>

        {/* Triangle: 45° at (290, 340), 90° at (390, 340), 45° at (390, 240).
            Legs both 100, hypotenuse ≈ 141.4 (= 100√2). */}
        <polygon
          points="290,340 390,340 390,240"
          fill="rgba(96, 165, 250, 0.08)"
          stroke={primaryColor}
          strokeWidth="1.5"
        />
        {/* Right-angle marker at (390, 340) */}
        <polyline points="383,340 383,333 390,333" fill="none" stroke={primaryColor} strokeWidth="1" />

        {/* Interior angle marks */}
        <TexLabel x={296} y={322} width={30} height={16} fill={labelColor} fontSize={11}>
          {String.raw`45^\circ`}
        </TexLabel>
        <TexLabel x={360} y={246} width={30} height={16} fill={labelColor} fontSize={11}>
          {String.raw`45^\circ`}
        </TexLabel>

        {/* Side labels */}
        {/* bottom leg (= 1) */}
        <TexLabel
          x={326}
          y={342}
          width={30}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
          align="center"
        >
          {String.raw`1`}
        </TexLabel>
        {/* right leg (= 1) */}
        <TexLabel
          x={394}
          y={283}
          width={16}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
        >
          {String.raw`1`}
        </TexLabel>
        {/* hypotenuse (= √2), above-left of midpoint (340, 290) */}
        <TexLabel
          x={312}
          y={278}
          width={30}
          height={18}
          fill={accentColor}
          fontSize={13}
          fontWeight={600}
        >
          {String.raw`\sqrt{2}`}
        </TexLabel>

        {/* Value list to the right */}
        <TexLabel
          x={450}
          y={246}
          width={120}
          height={18}
          fill={primaryColor}
          fontSize={12}
          fontWeight={600}
        >
          {String.raw`\text{at }45^\circ`}
        </TexLabel>
        <TexLabel x={450} y={266} width={160} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\sin 45^\circ = \tfrac{1}{\sqrt{2}}`}
        </TexLabel>
        <TexLabel x={450} y={286} width={160} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\cos 45^\circ = \tfrac{1}{\sqrt{2}}`}
        </TexLabel>
        <TexLabel x={450} y={306} width={160} height={20} fill={labelColor} fontSize={12}>
          {String.raw`\tan 45^\circ = 1`}
        </TexLabel>
        <TexLabel x={450} y={328} width={220} height={18} fill={dimColor} fontSize={10}>
          {String.raw`\tfrac{1}{\sqrt{2}} = \tfrac{\sqrt{2}}{2} \approx 0.707`}
        </TexLabel>
      </g>

      {/* ─── Bottom: Signs by quadrant (ASTC) ─── */}
      <g transform="translate(20 378)" fontSize="10" fill={labelColor}>
        <text x="0" y="0" fontWeight="600" fill={primaryColor}>
          Signs by quadrant:
        </text>
        <text x="118" y="0">Q1 all +  ·  Q2 sin +  ·  Q3 tan +  ·  Q4 cos +</text>
        <text x="400" y="0" fill={axisColor} fontStyle="italic">
          (All Students Take Calculus)
        </text>
      </g>
    </svg>
  )
}
