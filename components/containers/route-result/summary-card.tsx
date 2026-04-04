import type { RouteResult } from "@/lib/types"
import { formatTime, formatClockTime, addTime } from "@/lib/formatters"

interface SummaryCardProps {
  route: RouteResult
}

export function SummaryCard({ route }: SummaryCardProps) {
  const startTime = route.route[0]?.new_start_time
  const endTime = startTime ? addTime(startTime, route.total_time) : undefined
  const interchanges = route.route.length - 1

  return (
    <div className="flex w-full flex-col border-b border-border/60 pt-4 pb-6">
      <div className="grid grid-cols-2 divide-x divide-border/60">
        {/* Left Col: Duration */}
        <div className="flex flex-col pr-4">
          <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
            Trip Duration
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-3xl font-bold tracking-tight text-foreground">
              {formatTime(route.total_time)}
            </span>
          </div>
          {startTime && endTime && (
            <div className="mt-2 font-mono text-[11px] font-medium text-muted-foreground">
              {formatClockTime(startTime)} — {formatClockTime(endTime)}
            </div>
          )}
        </div>

        {/* Right Col: Stats */}
        <div className="flex flex-col justify-between pl-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              Fare
            </span>
            <span className="font-sans text-lg font-bold tracking-tight text-foreground">
              ₹{route.fare}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              Stops
            </span>
            <span className="font-sans text-sm font-semibold text-foreground">
              {route.stations}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              Changes
            </span>
            <span className="font-sans text-sm font-semibold text-foreground">
              {interchanges}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
