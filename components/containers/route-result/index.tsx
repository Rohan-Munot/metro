import type { RouteResult, RouteType } from "@/lib/types"
import { titleCase } from "@/lib/utils"
import { cn } from "@/lib/utils"
import {
  IconArrowsExchange,
  IconClock,
  IconCoin,
  IconRoute,
  IconTransfer,
} from "@tabler/icons-react"

const LINE_COLORS: Record<number, string> = {
  1: "bg-red-500", // Red Line
  2: "bg-yellow-400", // Yellow Line
  3: "bg-blue-500", // Blue Line
  4: "bg-blue-300", // Blue Line Branch
  5: "bg-green-500", // Green Line
  6: "bg-violet-500", // Violet Line
  7: "bg-pink-400", // Pink Line
  8: "bg-fuchsia-600", // Magenta Line
  9: "bg-gray-400", // Grey Line
  10: "bg-orange-400", // Orange Line (Airport Express)
  11: "bg-emerald-500", // Rapid Metro
  12: "bg-sky-400", // Aqua Line
}

const LINE_DOT_COLORS: Record<number, string> = {
  1: "border-red-500",
  2: "border-yellow-400",
  3: "border-blue-500",
  4: "border-blue-300",
  5: "border-green-500",
  6: "border-violet-500",
  7: "border-pink-400",
  8: "border-fuchsia-600",
  9: "border-gray-400",
  10: "border-orange-400",
  11: "border-emerald-500",
  12: "border-sky-400",
}

function RouteLeg({
  leg,
  isFirst,
  isLast,
}: {
  leg: RouteResult["route"][number]
  isFirst: boolean
  isLast: boolean
}) {
  const lineColor = LINE_COLORS[leg.line_no] ?? "bg-muted-foreground"
  const dotColor = LINE_DOT_COLORS[leg.line_no] ?? "border-muted-foreground"
  const middleStations = leg.path.slice(1, -1)

  return (
    <div className="relative">
      {/* Interchange badge */}
      {!isFirst && leg.station_interchange_time > 0 && (
        <div className="mb-2 ml-7 flex items-center gap-1.5 rounded-sm bg-accent px-2 py-1">
          <IconArrowsExchange size={12} className="text-muted-foreground" />
          <span className="text-[10px] tracking-wide text-muted-foreground">
            Change here &middot; {Math.round(leg.station_interchange_time)} min
          </span>
        </div>
      )}

      {/* Line label */}
      <div className="mb-2 ml-7 flex items-center gap-2">
        <span
          className={cn("inline-block h-2.5 w-2.5 rounded-full", lineColor)}
        />
        <span className="text-[11px] font-semibold tracking-wide text-foreground/80">
          {leg.line}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {leg.path_time}
        </span>
      </div>

      {/* Direction indicator */}
      {leg.towards_station && (
        <div className="mb-2 ml-7 text-[10px] text-muted-foreground/60">
          Towards {titleCase(leg.towards_station)}
          {leg.platform_name ? ` \u00B7 ${leg.platform_name}` : ""}
        </div>
      )}

      {/* Station list as vertical timeline */}
      <div className="relative ml-3">
        {/* First station (origin of leg) */}
        <div className="flex items-center gap-3 py-1">
          <div className="relative z-10 flex h-4 w-4 items-center justify-center">
            <span
              className={cn(
                "h-3 w-3 rounded-full border-2 bg-background",
                dotColor
              )}
            />
          </div>
          <span className="text-xs font-medium text-foreground">
            {titleCase(leg.path[0].name)}
          </span>
          {isFirst && leg.new_start_time && (
            <span className="text-[10px] text-muted-foreground">
              {leg.new_start_time.slice(0, 5)}
            </span>
          )}
        </div>

        {/* Middle stations (collapsed) */}
        {middleStations.length > 0 && (
          <div className="flex items-start gap-3 py-1">
            <div className="relative z-10 flex h-4 w-4 flex-col items-center justify-center gap-0.5">
              <span className={cn("h-1 w-1 rounded-full", lineColor)} />
              <span className={cn("h-1 w-1 rounded-full", lineColor)} />
              <span className={cn("h-1 w-1 rounded-full", lineColor)} />
            </div>
            <span className="text-[11px] text-muted-foreground/50">
              {middleStations.length} station
              {middleStations.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Last station (end of leg) */}
        <div className="flex items-center gap-3 py-1">
          <div className="relative z-10 flex h-4 w-4 items-center justify-center">
            <span
              className={cn(
                "h-3 w-3 rounded-full border-2 bg-background",
                dotColor,
                isLast && "border-primary bg-primary"
              )}
            />
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              isLast ? "text-primary" : "text-foreground"
            )}
          >
            {titleCase(leg.path[leg.path.length - 1].name)}
          </span>
          {isLast && leg.new_end_time && (
            <span className="text-[10px] text-muted-foreground">
              {leg.new_end_time.slice(0, 5)}
            </span>
          )}
        </div>

        {/* Vertical line connecting stations */}
        <div
          className={cn(
            "absolute top-3 bottom-3 left-[7px] w-0.5 rounded-full",
            lineColor
          )}
        />
      </div>
    </div>
  )
}

interface RouteResultContainerProps {
  route: RouteResult | null
  isLoading: boolean
  routeType: RouteType
  onRouteTypeChange: (type: RouteType) => void
}

export const RouteResultContainer = ({
  route,
  isLoading,
  routeType,
  onRouteTypeChange,
}: RouteResultContainerProps) => {
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-3"
        role="status"
        aria-label="Loading route"
      >
        <div className="h-10 animate-pulse rounded-md bg-muted/30" />
        <div
          className="h-32 animate-pulse rounded-md bg-muted/30"
          style={{ animationDelay: "100ms" }}
        />
        <div
          className="h-24 animate-pulse rounded-md bg-muted/30"
          style={{ animationDelay: "200ms" }}
        />
      </div>
    )
  }

  if (!route) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Route type toggle */}
      <div className="flex gap-1 rounded-md border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => onRouteTypeChange("least-distance")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors",
            routeType === "least-distance"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconRoute size={13} />
          Shortest
        </button>
        <button
          type="button"
          onClick={() => onRouteTypeChange("minimum-interchange")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors",
            routeType === "minimum-interchange"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <IconTransfer size={13} />
          Min. Interchange
        </button>
      </div>

      {/* Summary card */}
      <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-foreground">
            <IconClock size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold">{route.total_time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <IconCoin size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold">{route.fare}</span>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {route.stations} stations &middot;{" "}
          {route.route.length === 1
            ? "No interchange"
            : `${route.route.length - 1} interchange${route.route.length > 2 ? "s" : ""}`}
        </span>
      </div>

      {/* Route legs */}
      <div className="flex flex-col gap-4 pb-4">
        {route.route.map((leg, i) => (
          <RouteLeg
            key={`${leg.line_no}-${leg.start}`}
            leg={leg}
            isFirst={i === 0}
            isLast={i === route.route.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
