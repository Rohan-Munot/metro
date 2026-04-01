import type { Station } from "@/lib/types"
import type { ActiveField } from "./metro-search"
import { StationCard } from "./station-card"
import { IconSearch, IconSearchOff } from "@tabler/icons-react"

interface StationListProps {
  stations: Station[]
  query: string
  isLoading: boolean
  hasSearched: boolean
  activeField: ActiveField
  onSelect: (station: Station) => void
}

export function StationList({
  stations,
  query,
  isLoading,
  hasSearched,
  activeField,
  onSelect,
}: StationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" role="status" aria-label="Loading stations">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-md border border-border bg-muted/30 motion-reduce:animate-none"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (hasSearched && stations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <IconSearchOff
          size={28}
          strokeWidth={1.5}
          className="text-muted-foreground/30"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm text-muted-foreground">
            No stations found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/50">
            Try a different search term
          </p>
        </div>
      </div>
    )
  }

  if (!hasSearched) {
    const hint =
      activeField === "from"
        ? "Search for your origin station"
        : "Search for your destination station"

    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <IconSearch
          size={24}
          strokeWidth={1.5}
          className="text-muted-foreground/20"
          aria-hidden="true"
        />
        <p className="text-[11px] tracking-wide text-muted-foreground/40">
          {hint}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] tracking-wide text-muted-foreground/50">
        {stations.length} station{stations.length !== 1 ? "s" : ""} found
        &mdash; tap to select{" "}
        {activeField === "from" ? "origin" : "destination"}
      </p>
      <div className="flex flex-col gap-2">
        {stations.map((station, i) => (
          <StationCard
            key={station.id}
            station={station}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
