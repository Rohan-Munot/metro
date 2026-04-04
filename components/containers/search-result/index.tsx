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

  if (!geocode && !geocodeLoading) {
    // Geocoding returned nothing — just show no results
    return null
  }

  const label = geocode
    ? `Nearest metro to ${geocode.formatted_address.split(",")[0]}`
    : "Finding nearest metro..."

  return (
    <div className="mt-4">
      <NearbyResultContainer
        nearbyStations={nearbyStations}
        isLoading={isLoading}
        error={nearbyError}
        label={label}
        onSelect={onSelect}
      />
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
    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
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
              Searching for nearest metro station...
            </p>
          </div>
        </div>
        <LandmarkFallback query={query} onSelect={onSelect} />
      </div>
    )
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
