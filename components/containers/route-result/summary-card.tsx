import type { RouteResult } from "@/lib/types"
import { formatTime, formatClockTime, addTime } from "@/lib/utils"
import {
  IconClock,
  IconArrowRight,
  IconTransfer,
  IconMapPin,
  IconCurrencyRupee,
} from "@tabler/icons-react"

interface SummaryCardProps {
  route: RouteResult
}

export function SummaryCard({ route }: SummaryCardProps) {
  const startTime = route.route[0]?.new_start_time
  const endTime = startTime ? addTime(startTime, route.total_time) : undefined
  const interchanges = route.route.length - 1

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      {/* Row 1 — Duration & Fare (primary info, bold) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconClock className="size-4.5 text-foreground/80" />
          <span className="text-base font-bold text-primary tabular-nums">
            {formatTime(route.total_time)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconCurrencyRupee className="size-4.5 text-foreground/80" />
          <span className="text-base font-bold text-primary tabular-nums">
            {route.fare}
          </span>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="my-2 h-px bg-border/80" />

      {/* Row 2 — Time range & Stats (supporting context, muted) */}
      <div className="flex items-center justify-between text-sm text-accent-foreground">
        {startTime && endTime ? (
          <span className="flex items-center gap-1 tabular-nums">
            {formatClockTime(startTime)}
            <IconArrowRight className="size-3" />
            {formatClockTime(endTime)}
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3 text-sm text-accent-foreground">
          <span className="flex items-center gap-1">
            <IconMapPin className="size-4" />
            {route.stations}
          </span>
          <span className="flex items-center gap-1">
            <IconTransfer className="size-4" />
            {interchanges}
          </span>
        </div>
      </div>
    </div>
  )
}
