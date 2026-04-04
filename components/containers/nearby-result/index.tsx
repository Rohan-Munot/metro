import type { NearbyStation, Station } from "@/lib/types"
import { IconMapPinOff } from "@tabler/icons-react"
import { NearbyStationCard } from "./nearby-station-card"

interface NearbyResultContainerProps {
  nearbyStations: NearbyStation[]
  isLoading: boolean
  error: Error | null
  label: string
  onSelect: (station: Station) => void
}

export function NearbyResultContainer({
  nearbyStations,
  isLoading,
  error,
  label,
  onSelect,
}: NearbyResultContainerProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-2"
        role="status"
        aria-label="Finding nearby stations"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-md border border-border bg-muted/60 motion-reduce:animate-none"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <IconMapPinOff
          size={28}
          strokeWidth={1.5}
          className="text-muted-foreground/30"
        />
        <p className="text-sm text-muted-foreground">
          Could not find nearby stations
        </p>
      </div>
    )
  }

  if (nearbyStations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <IconMapPinOff
          size={28}
          strokeWidth={1.5}
          className="text-muted-foreground/30"
        />
        <p className="text-sm text-muted-foreground">
          No metro stations found nearby
        </p>
        <p className="text-[11px] text-muted-foreground/50">
          Try searching within 3 km of a metro station
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="sticky top-0 z-20 rounded-sm bg-card p-1 px-3.5 text-[11px] tracking-wide text-muted-foreground/80">
        {label} &mdash; tap to select
      </p>
      <div className="flex flex-col gap-2">
        {nearbyStations.map((nearby, i) => (
          <NearbyStationCard
            key={`${nearby.name}-${i}`}
            nearby={nearby}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
