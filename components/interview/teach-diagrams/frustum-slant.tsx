export function FrustumSlant() {
  const curveColor = "#94a3b8"
  const geometryColor = "#60a5fa"
  const accentColor = "#f59e0b"
  const labelColor = "#e2e8f0"

  return (
    <svg
      viewBox="0 0 420 220"
      className="w-full max-w-xl mx-auto"
      role="img"
      aria-label="Derivation sketch: a short curve segment's tilted length ds from Pythagoras, then rotated to form a frustum with that slant"
    >
      <defs>
        <marker
          id="fs-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      {/* LEFT PANEL — curve strip with ds = sqrt(dx^2 + dy^2) */}
      <g>
        {/* Axis */}
        <line x1="20" y1="180" x2="200" y2="180" stroke={curveColor} strokeWidth="1" />
        <text x="202" y="184" fill={curveColor} fontSize="10">
          x
        </text>

        {/* Curve y = f(x) */}
        <path
          d="M 30 160 Q 80 100, 130 70 T 200 35"
          stroke={curveColor}
          strokeWidth="1.5"
          fill="none"
        />
        <text x="205" y="40" fill={curveColor} fontSize="10" fontStyle="italic">
          y = f(x)
        </text>

        {/* Zoomed strip: pick x-segment from 95 to 135 on the curve */}
        {/* Curve values approximately: at x=95 → y ≈ 88; at x=135 → y ≈ 66 */}
        {/* Triangle: (95, 88), (135, 88) [horizontal dx], (135, 66) [vertical dy], hypotenuse (95,88)→(135,66) is ds */}
        <line x1="95" y1="88" x2="135" y2="88" stroke={accentColor} strokeWidth="1.5" />
        <line x1="135" y1="88" x2="135" y2="66" stroke={accentColor} strokeWidth="1.5" />
        <line x1="95" y1="88" x2="135" y2="66" stroke={geometryColor} strokeWidth="2.2" />

        {/* Right-angle marker */}
        <polyline
          points="130,88 130,83 135,83"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
        />

        {/* Dots at curve-strip endpoints */}
        <circle cx="95" cy="88" r="2.5" fill={geometryColor} />
        <circle cx="135" cy="66" r="2.5" fill={geometryColor} />

        {/* Labels */}
        <text x="108" y="102" fill={accentColor} fontSize="11" fontStyle="italic">
          dx
        </text>
        <text x="139" y="80" fill={accentColor} fontSize="11" fontStyle="italic">
          dy
        </text>
        <text x="100" y="66" fill={geometryColor} fontSize="12" fontStyle="italic" fontWeight="600">
          ds
        </text>
        <text x="100" y="80" fill={geometryColor} fontSize="9">
          = √(dx² + dy²)
        </text>

        {/* Caption */}
        <text x="30" y="205" fill={labelColor} fontSize="10" fontStyle="italic">
          Pythagoras on a curve strip
        </text>
      </g>

      {/* Arrow between panels */}
      <g color={curveColor}>
        <line
          x1="220"
          y1="110"
          x2="250"
          y2="110"
          stroke={curveColor}
          strokeWidth="1.5"
          markerEnd="url(#fs-arrow)"
        />
      </g>
      <text x="221" y="102" fill={curveColor} fontSize="9" fontStyle="italic">
        revolve
      </text>

      {/* RIGHT PANEL — frustum (truncated cone lying along the x-axis).
          Frustum with two circular rims.
          Left rim: center (300, 110), rx=14, ry=32 (larger radius = f(x) at x=95)
          Right rim: center (380, 110), rx=10, ry=22 (smaller radius = f(x) at x=135) */}
      <g>
        {/* Axis of revolution */}
        <line
          x1="270"
          y1="110"
          x2="410"
          y2="110"
          stroke={curveColor}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Slant lines (top and bottom of the frustum viewed from side) */}
        <line x1="300" y1="78" x2="380" y2="88" stroke={geometryColor} strokeWidth="2" />
        <line x1="300" y1="142" x2="380" y2="132" stroke={geometryColor} strokeWidth="2" />

        {/* Right rim (smaller) — draw full ellipse */}
        <ellipse
          cx="380"
          cy="110"
          rx="10"
          ry="22"
          fill="rgba(96, 165, 250, 0.1)"
          stroke={geometryColor}
          strokeWidth="1.5"
        />

        {/* Left rim (larger) — full ellipse */}
        <ellipse
          cx="300"
          cy="110"
          rx="14"
          ry="32"
          fill="rgba(96, 165, 250, 0.1)"
          stroke={geometryColor}
          strokeWidth="1.5"
        />

        {/* Labels */}
        <text x="273" y="72" fill={labelColor} fontSize="11" fontStyle="italic">
          2πf(x)
        </text>
        <text x="273" y="85" fill={curveColor} fontSize="9">
          (circumference)
        </text>
        <text x="322" y="72" fill={geometryColor} fontSize="12" fontStyle="italic" fontWeight="600">
          ds
        </text>
        <text x="315" y="85" fill={curveColor} fontSize="9">
          (slant length)
        </text>

        {/* Caption */}
        <text x="270" y="205" fill={labelColor} fontSize="10" fontStyle="italic">
          dS = 2π f(x) · ds
        </text>
      </g>
    </svg>
  )
}
