"use client"

import type { RouteResult } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getLineColors } from "./line-colors"
import { InterchangeBadge } from "./interchange-badge"
import { useState } from "react"
import { IconPlus, IconMinus, IconClock } from "@tabler/icons-react"
import { titleCase } from "@/lib/formatters"

interface JourneySegmentProps {
  leg: RouteResult["route"][number]
  isFirst: boolean
}

export function JourneySegment({ leg, isFirst }: JourneySegmentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const colors = getLineColors(leg.line_no)
  const middleStations = leg.path.slice(1, -1)
  const startStation = leg.path[0]
  const endStation = leg.path[leg.path.length - 1]

  return (
    <div className="relative pt-1 pb-4">
      {!isFirst && (
        <div className="py-2">
          <InterchangeBadge
            minutes={Math.round(leg.station_interchange_time)}
          />
        </div>
      )}

      {/* Segment Header */}
      <div className="flex items-baseline justify-between pt-2 pb-1">
        <div className="flex items-center gap-2">
          <div className={cn("h-1 w-4 rounded-sm", colors.bg)} />
          <span className="font-sans text-[13px] font-bold tracking-widest text-foreground uppercase">
            {leg.line}
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-muted-foreground/60">
          <IconClock size={12} stroke={1.5} className="inline-block" />
          <span>{leg.path_time}</span>
        </div>
      </div>

      {/* Direction & Platform */}
      {leg.towards_station && (
        <div className="flex flex-wrap items-center justify-between gap-1 pb-3 pl-6 font-sans text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Towards</span>
            <span className="font-medium text-foreground/80">
              {titleCase(leg.towards_station)}
            </span>
          </div>
          {leg.platform_name && (
            <span className="rounded-sm border border-border/50 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Platform {leg.platform_name.replace(/Platform No. /i, "")}
            </span>
          )}
        </div>
      )}

      {/* Sharp Timeline */}
      <div className="relative pl-6">
        {/* The thin spine line */}
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 left-2 w-[1px] opacity-40",
            colors.bg
          )}
        />

        {/* Origin */}
        <div className="relative flex items-center py-1">
          <div
            className={cn(
              "absolute top-1 -left-4.75 h-2 w-2 rounded-sm border border-background",
              colors.bg
            )}
          />
          <span className="font-sans text-[14px] leading-none font-medium text-foreground">
            {titleCase(startStation.name)}
          </span>
        </div>

        {/* Middle Stations Toggle & List */}
        {middleStations.length > 0 && (
          <div className="pt-1.5 pl-[1px]">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 rounded-sm bg-accent px-1.5 py-0.5 font-sans text-xs font-medium text-accent-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {isExpanded ? (
                <IconMinus size={10} stroke={2} />
              ) : (
                <IconPlus size={10} stroke={2} />
              )}
              {middleStations.length} stops
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="flex flex-col gap-2 pt-2">
                {middleStations.map((station, i) => (
                  <div key={i} className="relative flex items-center">
                    <div
                      className={cn(
                        "absolute -left-4.75 h-1.5 w-[1px]",
                        colors.bg
                      )}
                    />
                    <span className="font-sans text-[12px] leading-none text-muted-foreground/70">
                      {titleCase(station.name)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Destination */}
        <div className="relative mt-1 flex items-center py-1">
          <div
            className={cn(
              "absolute bottom-1 -left-[19px] h-2 w-2 rounded-sm border border-background",
              colors.bg
            )}
          />
          <span className="font-sans text-[14px] leading-none font-medium text-foreground">
            {titleCase(endStation.name)}
          </span>
        </div>
      </div>
    </div>
  )
}
