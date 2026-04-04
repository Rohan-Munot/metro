"use client"

import { IconArrowsUpDown, IconCurrentLocation } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SearchField } from "./search-field"
import { useState } from "react"
import { SearchResultContainer } from "../search-result"
import { RouteResultContainer } from "../route-result"
import { NearbyResultContainer } from "../nearby-result"
import { useStationSearch } from "@/hooks/use-station-search"
import { useRouteSearch } from "@/hooks/use-route-search"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useNearbyStations } from "@/hooks/use-nearby-stations"
import type { Station, RouteType } from "@/lib/types"
import { titleCase } from "@/lib/formatters"
import { cn } from "@/lib/utils"

type ActiveField = "origin" | "destination"

interface SearchContainerProps {
  initialOrigin?: Station | null
  initialDestination?: Station | null
}

export function SearchContainer({
  initialOrigin,
  initialDestination,
}: SearchContainerProps) {
  const [originQuery, setOriginQuery] = useState(
    initialOrigin ? titleCase(initialOrigin.station_name) : ""
  )
  const [destinationQuery, setDestinationQuery] = useState(
    initialDestination ? titleCase(initialDestination.station_name) : ""
  )
  const [activeField, setActiveField] = useState<ActiveField>("origin")
  const [routeType, setRouteType] = useState<RouteType>("least-distance")

  const [selectedOrigin, setSelectedOrigin] = useState<Station | null>(
    initialOrigin ?? null
  )
  const [selectedDestination, setSelectedDestination] =
    useState<Station | null>(initialDestination ?? null)

  // Geolocation state
  const {
    state: geoState,
    request: requestLocation,
    reset: resetGeo,
  } = useGeolocation()
  const geoCoords =
    geoState.status === "success"
      ? { lat: geoState.lat, lng: geoState.lng }
      : null

  // Nearby stations from geolocation
  const {
    nearbyStations,
    isLoading: nearbyLoading,
    error: nearbyError,
  } = useNearbyStations(geoCoords?.lat ?? null, geoCoords?.lng ?? null)

  const showNearby =
    geoState.status === "locating" || geoState.status === "success"

  const updateUrl = (params: URLSearchParams) => {
    const qs = params.toString()
    history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }

  const bothSelected = !!selectedOrigin && !!selectedDestination

  const isOrigin = activeField === "origin"
  const activeQuery = bothSelected
    ? ""
    : (isOrigin ? selectedOrigin : selectedDestination)
      ? ""
      : isOrigin
        ? originQuery
        : destinationQuery

  const {
    stations,
    isLoading: searchLoading,
    hasSearched,
  } = useStationSearch(showNearby ? "" : activeQuery)

  const {
    route,
    isLoading: routeLoading,
    error: routeError,
  } = useRouteSearch(
    selectedOrigin?.station_code ?? null,
    selectedDestination?.station_code ?? null,
    routeType
  )

  const setSelection = (field: ActiveField, station: Station | null) => {
    if (field === "origin") {
      setSelectedOrigin(station)
      setOriginQuery(station ? titleCase(station.station_name) : "")
    } else {
      setSelectedDestination(station)
      setDestinationQuery(station ? titleCase(station.station_name) : "")
    }
  }

  const handleSelect = (station: Station) => {
    const params = new URLSearchParams(window.location.search)

    // Dismiss geo panel on selection
    resetGeo()

    if (activeField === "origin") {
      setSelection("origin", station)
      params.set("origin", station.station_name)
      if (!selectedDestination) {
        setActiveField("destination")
      }
    } else {
      setSelection("destination", station)
      params.set("destination", station.station_name)
    }
    updateUrl(params)
  }

  const handleClear = (field: ActiveField) => {
    const params = new URLSearchParams(window.location.search)

    if (field === "origin") {
      setSelection("origin", null)
      params.delete("origin")
    } else {
      setSelection("destination", null)
      params.delete("destination")
    }

    updateUrl(params)
  }

  const handleSwap = () => {
    const params = new URLSearchParams(window.location.search)

    setSelection("origin", selectedDestination)
    setSelection("destination", selectedOrigin)

    if (selectedDestination)
      params.set("origin", selectedDestination.station_name)
    else params.delete("origin")

    if (selectedOrigin) params.set("destination", selectedOrigin.station_name)
    else params.delete("destination")

    updateUrl(params)
  }

  const handleChange = (field: ActiveField, value: string) => {
    // Typing dismisses geo panel
    resetGeo()
    if (field === "origin") {
      setOriginQuery(value)
      setSelectedOrigin(null)
    } else {
      setDestinationQuery(value)
      setSelectedDestination(null)
    }
  }

  const handleLocationClick = () => {
    // Clear any active search text so nearby panel takes focus
    if (activeField === "origin") {
      setOriginQuery("")
      setSelectedOrigin(null)
    } else {
      setDestinationQuery("")
      setSelectedDestination(null)
    }
    requestLocation()
  }

  const nearbyLabel =
    activeField === "origin"
      ? "Nearby stations — set as origin"
      : "Nearby stations — set as destination"

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-col gap-2">
          <SearchField
            placeholder="e.g. Rajiv Chowk"
            value={originQuery}
            onChange={(value) => handleChange("origin", value)}
            onFocus={() => setActiveField("origin")}
            onClear={() => handleClear("origin")}
          />
          <SearchField
            placeholder="e.g. India Gate"
            value={destinationQuery}
            onChange={(value) => handleChange("destination", value)}
            onFocus={() => setActiveField("destination")}
            onClear={() => handleClear("destination")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            className="swap-button size-8 text-primary"
            onClick={handleSwap}
          >
            <IconArrowsUpDown className="size-4.5" />
          </Button>
          {!bothSelected && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleLocationClick}
              className={cn(
                "size-8 text-primary transition-all",
                activeField === "destination" && "mt-auto"
              )}
              aria-label="Use my location"
            >
              <IconCurrentLocation className="size-4.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {bothSelected ? (
          <RouteResultContainer
            route={route}
            isLoading={routeLoading}
            error={routeError}
            onRetry={() => {}}
            routeType={routeType}
            onRouteTypeChange={setRouteType}
          />
        ) : showNearby ? (
          <NearbyResultContainer
            nearbyStations={nearbyStations}
            isLoading={nearbyLoading}
            error={nearbyError}
            label={nearbyLabel}
            onSelect={handleSelect}
          />
        ) : (
          <SearchResultContainer
            stations={stations}
            query={activeQuery}
            isLoading={searchLoading}
            hasSearched={hasSearched}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  )
}
