"use client"

import type { NearbyStation, Station } from "@/lib/types"
import { IconSearchOff, IconMapPin, IconTrain } from "@tabler/icons-react"
import { StationCard } from "./station-card"
import { MetroMapIllustration } from "./metro-map-illustration"
import { NearbyResultContainer } from "../nearby-result"
import { useGeocode } from "@/hooks/use-geocode"
import { useNearbyStations } from "@/hooks/use-nearby-stations"

interface SearchResultContainerProps {
  stations: Station[]
  query: string
  isLoading: boolean
  hasSearched: boolean
  onSelect: (station: Station) => void
}

/**
 * Handles the entire "no direct station match" flow as a single unified state.
 * The user sees: loading → nearby results OR a single error. Never two errors.
 */
function LandmarkFallback({
  query,
  onSelect,
}: {
  query: string
  onSelect: (station: Station) => void
}) {
  const { geocode, isLoading: geocodeLoading } = useGeocode(query)
  const {
    nearbyStations,
    isLoading: nearbyLoading,
    error: nearbyError,
  } = useNearbyStations(geocode?.lat ?? null, geocode?.lng ?? null)

  const isLoading = geocodeLoading || (geocode !== null && nearbyLoading)

  // Still working — show skeletons
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-2"
        role="status"
        aria-label="Searching nearby stations"
      >
        <p className="px-3.5 text-[11px] tracking-wide text-muted-foreground/60">
          Searching for nearby metro stations&hellip;
        </p>
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

  // Geocode found a location AND nearby stations exist — show them
  if (geocode && nearbyStations.length > 0 && !nearbyError) {
    const label = `Nearest metro to ${geocode.formatted_address.split(",")[0]}`
    return (
      <NearbyResultContainer
        nearbyStations={nearbyStations}
        isLoading={false}
        error={null}
        label={label}
        onSelect={onSelect}
      />
    )
  }

  // Everything failed — single unified error
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <IconSearchOff
        size={28}
        strokeWidth={1.5}
        className="text-muted-foreground/30"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="mt-1.5 max-w-[240px] text-[11px] leading-relaxed text-muted-foreground/50">
          Try a specific landmark or station name, e.g.
          &ldquo;India&nbsp;Gate&rdquo; or &ldquo;Rajiv&nbsp;Chowk&rdquo;
        </p>
      </div>
    </div>
  )
}

export const SearchResultContainer = ({
  stations,
  query,
  isLoading,
  hasSearched,
  onSelect,
}: SearchResultContainerProps) => {
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-2"
        role="status"
        aria-label="Loading stations"
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

  if (hasSearched && stations.length === 0) {
    return <LandmarkFallback query={query} onSelect={onSelect} />
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center px-4 py-8">
        <MetroMapIllustration />
        <p className="mt-2 max-w-[220px] text-center text-xs leading-relaxed tracking-wide text-muted-foreground/45">
          Search for a metro station or a landmark
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="sticky top-0 z-20 rounded-sm bg-card p-1 px-3.5 text-[11px] tracking-wide text-muted-foreground/80">
        {stations.length} station{stations.length !== 1 ? "s" : ""} found
        &mdash; tap to select
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
