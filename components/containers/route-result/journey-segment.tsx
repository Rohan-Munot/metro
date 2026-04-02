"use client"

import type { RouteResult } from "@/lib/types"
import { titleCase } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { getLineColors } from "./line-colors"
import { StationDot } from "./station-dot"
import { StationList } from "./station-list"
import { InterchangeBadge } from "./interchange-badge"

/* ------------------------------------------------------------------ */
/*  Journey segment — one metro line within a route                    */
/* ------------------------------------------------------------------ */

interface JourneySegmentProps {
  leg: RouteResult["route"][number]
  isFirst: boolean
  isLast: boolean
}

export function JourneySegment({ leg, isFirst, isLast }: JourneySegmentProps) {
  const colors = getLineColors(leg.line_no)
  const middleStations = leg.path.slice(1, -1)
  const startStation = leg.path[0]
  const endStation = leg.path[leg.path.length - 1]

  return (
    <div>
      {/* Interchange divider — sits between segments */}
      {!isFirst && (
        <InterchangeBadge minutes={Math.round(leg.station_interchange_time)} />
      )}

      {/* ---- Segment header: line identity ---- */}
      <div className="flex items-center gap-2.5 pt-2 pb-1">
        <span
          className={cn(
            "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
            colors.bg
          )}
        />
        <span className="font-sans text-base leading-tight font-semibold tracking-wide text-foreground">
          {leg.line}
        </span>
        <span className="font-mono text-sm leading-tight text-muted-foreground">
          {leg.path_time}
        </span>
      </div>

      {/* Direction + platform */}
      {leg.towards_station && (
        <div className="pb-2 pl-[26px] font-sans text-sm leading-relaxed text-muted-foreground">
          Towards{" "}
          <span className="font-medium text-foreground/70">
            {titleCase(leg.towards_station)}
          </span>
          {leg.platform_name && (
            <>
              {" "}
              &middot;{" "}
              <span className="font-medium text-foreground/70">
                {leg.platform_name}
              </span>
            </>
          )}
        </div>
      )}

      {/* ---- Station timeline ---- */}
      {/*
        Layout: a left rail (dots + colored line) paired with station names.
        The rail uses relative positioning with an absolute colored bar
        connecting the dots — this is the one place absolute is appropriate.
      */}
      <div className="relative pl-[26px]">
        {/* Vertical rail — absolute, connects first dot to last */}
        <div
          className={cn(
            "absolute top-[10px] bottom-[10px] left-[5.5px] w-[3px] rounded-full",
            colors.bg
          )}
        />

        {/* Origin station */}
        <div className="relative flex items-center gap-3 py-1.5">
          <StationDot borderColor={colors.border} />
          <span className="font-sans text-base leading-6 font-medium text-foreground">
            {titleCase(startStation.name)}
          </span>
        </div>

        {/* Middle stations — expandable */}
        {middleStations.length > 0 && (
          <div className="relative py-0.5 pl-[23px]">
            <StationList stations={middleStations} lineColor={colors.bg} />
          </div>
        )}

        {/* Destination station */}
        <div className="relative flex items-center gap-3 py-1.5">
          <StationDot
            borderColor={colors.border}
            filled={isLast}
            fillColor={colors.bg}
          />
          <span
            className={cn(
              "font-sans text-base leading-6 font-medium",
              isLast ? colors.text : "text-foreground"
            )}
          >
            {titleCase(endStation.name)}
          </span>
        </div>
      </div>
    </div>
  )
}
