"use client"

const COLORS = {
  red: "#EF4444",
  yellow: "#EAB308",
  blue: "#3B82F6",
  violet: "#8B5CF6",
} as const

export function MetroMapIllustration() {
  return (
    <svg
      viewBox="0 0 280 200"
      className="block h-auto w-full"
      fill="none"
      role="img"
      aria-label="Delhi Metro route map"
    >
      {/* ── LINES ─────────────────────────────── */}

      {/* Red Line — horizontal across the top with a slight bend */}
      <path
        d="M 16 52 L 80 52 L 120 52 L 160 52 L 220 52 L 264 52"
        stroke={COLORS.red}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Yellow Line — vertical through center */}
      <path
        id="yellowLine"
        d="M 120 16 L 120 52 L 120 100 L 120 148 L 120 184"
        stroke={COLORS.yellow}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Blue Line — the long east-west with a 45° jog through center */}
      <path
        id="blueLine"
        d="M 16 130 L 52 130 L 80 100 L 120 100 L 160 100 L 192 100 L 228 130 L 264 130"
        stroke={COLORS.blue}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Violet Line — vertical on the east side, slight diagonal to Kashmere Gate */}
      <path
        d="M 160 52 L 160 100 L 160 148 L 160 184"
        stroke={COLORS.violet}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* ── STATIONS ──────────────────────────── */}

      {/* Red Line stations */}
      <StationDot cx={16} cy={52} color={COLORS.red} />
      <StationDot cx={80} cy={52} color={COLORS.red} />
      <StationDot cx={220} cy={52} color={COLORS.red} />
      <StationDot cx={264} cy={52} color={COLORS.red} />

      {/* Yellow Line stations */}
      <StationDot cx={120} cy={16} color={COLORS.yellow} />
      <StationDot cx={120} cy={148} color={COLORS.yellow} />
      <StationDot cx={120} cy={184} color={COLORS.yellow} />

      {/* Blue Line stations */}
      <StationDot cx={16} cy={130} color={COLORS.blue} />
      <StationDot cx={52} cy={130} color={COLORS.blue} />
      <StationDot cx={192} cy={100} color={COLORS.blue} />
      <StationDot cx={228} cy={130} color={COLORS.blue} />
      <StationDot cx={264} cy={130} color={COLORS.blue} />

      {/* Violet Line stations */}
      <StationDot cx={160} cy={148} color={COLORS.violet} />
      <StationDot cx={160} cy={184} color={COLORS.violet} />

      {/* ── INTERCHANGES ──────────────────────── */}

      {/* Kashmere Gate — Red / Yellow / Violet  (120,52)↔(160,52) region */}
      <InterchangeStation cx={120} cy={52} />
      <InterchangeStation cx={160} cy={52} />

      {/* Rajiv Chowk — Yellow / Blue */}
      <InterchangeStation cx={120} cy={100} />

      {/* Mandi House — Blue / Violet */}
      <InterchangeStation cx={160} cy={100} />

      {/* ── ANIMATED TRAINS ───────────────────── */}

      {/* Train on Yellow Line */}
      <circle r="3.5" fill={COLORS.yellow} opacity="0.9">
        <animateMotion
          dur="5s"
          repeatCount="indefinite"
          keyPoints="0;1;1;0"
          keyTimes="0;0.45;0.55;1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1"
        >
          <mpath href="#yellowLine" />
        </animateMotion>
      </circle>

      {/* Train on Blue Line */}
      <circle r="3.5" fill={COLORS.blue} opacity="0.9">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          keyPoints="0;1;1;0"
          keyTimes="0;0.45;0.55;1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1"
        >
          <mpath href="#blueLine" />
        </animateMotion>
      </circle>

      {/* Subtle pulse at Rajiv Chowk — the busiest interchange */}
      <circle cx={120} cy={100} r="6" fill={COLORS.blue} opacity="0.05">
        <animate
          attributeName="r"
          values="6;14;6"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.08;0.01;0.08"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

/* ── Sub-components ───────────────────────────── */

function StationDot({
  cx,
  cy,
  color,
}: {
  cx: number
  cy: number
  color: string
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="3"
      fill="var(--background)"
      stroke={color}
      strokeWidth="1.5"
    />
  )
}

function InterchangeStation({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill="var(--background)"
        stroke="var(--foreground)"
        strokeWidth="2"
      />
      <circle cx={cx} cy={cy} r="2" fill="var(--foreground)" opacity="0.3" />
    </>
  )
}
