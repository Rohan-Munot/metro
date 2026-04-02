"use client"

import { useState, useCallback } from "react"
import { titleCase } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { IconChevronDown } from "@tabler/icons-react"
import { StationDot } from "./station-dot"

/* ------------------------------------------------------------------ */
/*  Expandable intermediate station list                               */
/* ------------------------------------------------------------------ */

interface StationListProps {
  stations: { name: string; status: string }[]
  lineColor: string
}

export function StationList({ stations, lineColor }: StationListProps) {
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded((prev) => !prev), [])

  if (stations.length === 0) return null

  return (
    <div className="flex flex-col">
      {/* Toggle button */}
      <button
        type="button"
        onClick={toggle}
        className="group flex items-center gap-2 py-1.5 text-left"
      >
        <span className="flex items-center gap-1.5 font-sans text-sm leading-6 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
          {stations.length} station{stations.length !== 1 ? "s" : ""}
          <IconChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </span>
      </button>

      {/* Expanded station list */}
      {expanded && (
        <div className="flex flex-col gap-0.5">
          {stations.map((station) => (
            <div key={station.name} className="flex items-center gap-2 py-1">
              <StationDot small fillColor={lineColor} />
              <span className="font-sans text-sm leading-6 text-muted-foreground/50">
                {titleCase(station.name)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
