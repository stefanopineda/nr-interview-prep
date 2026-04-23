export function FbdInclinedPlane() {
  const geometryColor = "#94a3b8"
  const primaryColor = "#60a5fa"
  const accentColor = "#f59e0b"
  const labelColor = "#e2e8f0"

  return (
    <svg
      viewBox="0 0 360 220"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Free body diagram of a block on an inclined ramp showing weight decomposed into normal and parallel components"
    >
      <defs>
        <marker
          id="fbd-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* Ground */}
      <line x1="20" y1="200" x2="340" y2="200" stroke={geometryColor} strokeWidth="1.5" />

      {/* Ramp: right triangle, right angle at bottom-right (320, 200), apex at (320, 70), base at (60, 200) */}
      <polygon
        points="60,200 320,200 320,70"
        fill="rgba(148, 163, 184, 0.08)"
        stroke={geometryColor}
        strokeWidth="1.5"
      />

      {/* Angle theta arc at base (60, 200) */}
      <path
        d="M 110 200 A 50 50 0 0 0 108 188"
        fill="none"
        stroke={geometryColor}
        strokeWidth="1.2"
      />
      <text x="118" y="195" fill={labelColor} fontSize="13" fontStyle="italic">
        θ
      </text>

      {/* Block on the ramp — rectangle tilted to sit flush with the incline.
          Ramp slope = rise/run = 130/260 = 0.5 → angle ≈ 26.57°
          cos ≈ 0.8944, sin ≈ 0.4472
          Block center at ramp midpoint (190, 135). */}
      <g transform="translate(190 135) rotate(-26.57)">
        <rect
          x="-26"
          y="-20"
          width="52"
          height="32"
          fill="rgba(96, 165, 250, 0.15)"
          stroke={primaryColor}
          strokeWidth="1.5"
          rx="2"
        />
        <text x="0" y="2" fill={labelColor} fontSize="12" textAnchor="middle" fontStyle="italic">
          m
        </text>
      </g>

      {/* Weight vector mg — straight down from block center */}
      <g stroke={primaryColor} fill={primaryColor} color={primaryColor}>
        <line
          x1="190"
          y1="135"
          x2="190"
          y2="195"
          strokeWidth="2"
          markerEnd="url(#fbd-arrow)"
        />
      </g>
      <text x="196" y="178" fill={primaryColor} fontSize="13" fontStyle="italic">
        mg
      </text>

      {/* Normal force — perpendicular to ramp surface, pointing away from ramp.
          Ramp direction vector (down-ramp, pointing toward base): (-260, 130) normalized ≈ (-0.894, 0.447).
          Outward normal (left-up relative to viewer): rotate 90° CCW → (-0.447, -0.894).
          Length 55. Start at block center (190, 135). End: (190 - 55*0.447, 135 - 55*0.894) = (165.4, 85.8) */}
      <g stroke={accentColor} fill={accentColor} color={accentColor}>
        <line
          x1="190"
          y1="135"
          x2="165.4"
          y2="85.8"
          strokeWidth="2.2"
          markerEnd="url(#fbd-arrow)"
        />
      </g>
      <text x="138" y="80" fill={accentColor} fontSize="13" fontStyle="italic" fontWeight="600">
        N
      </text>
      <text x="125" y="96" fill={accentColor} fontSize="11" fontStyle="italic">
        = mg cos θ
      </text>

      {/* Parallel component (gravity along ramp, pointing down-ramp toward base)
          Down-ramp unit vector: (-0.894, 0.447). Length 48. Start at block center.
          End: (190 - 48*0.894, 135 + 48*0.447) = (147.1, 156.5) */}
      <g stroke={accentColor} fill={accentColor} color={accentColor}>
        <line
          x1="190"
          y1="135"
          x2="147.1"
          y2="156.5"
          strokeWidth="2.2"
          strokeDasharray="4 3"
          markerEnd="url(#fbd-arrow)"
        />
      </g>
      <text x="90" y="170" fill={accentColor} fontSize="13" fontStyle="italic" fontWeight="600">
        mg sin θ
      </text>

      {/* Dashed guideline showing the decomposition rectangle — optional visual aid.
          From weight-arrow tip (190, 195) back along normal direction to close the parallelogram.
          Skip: keeps diagram uncluttered. */}
    </svg>
  )
}
