"use client"

import { IconArrowsUpDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SearchField } from "./search-field"
import { useState } from "react"
import { SearchResultContainer } from "../search-result"
import { RouteResultContainer } from "../route-result"
import { useStationSearch } from "@/hooks/use-station-search"
import { useRouteSearch } from "@/hooks/use-route-search"
import type { Station, RouteType } from "@/lib/types"
import { titleCase } from "@/lib/formatters"

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
  } = useStationSearch(activeQuery)

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
    setSelection("origin", selectedDestination)
    setSelection("destination", selectedOrigin)
  }

  const handleChange = (field: ActiveField, value: string) => {
    if (field === "origin") {
      setOriginQuery(value)
      setSelectedOrigin(null)
    } else {
      setDestinationQuery(value)
      setSelectedDestination(null)
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-col gap-2">
          <SearchField
            placeholder="Search station or place"
            value={originQuery}
            onChange={(value) => handleChange("origin", value)}
            onFocus={() => setActiveField("origin")}
            onClear={() => handleClear("origin")}
          />
          <SearchField
            placeholder="Search station or place"
            value={destinationQuery}
            onChange={(value) => handleChange("destination", value)}
            onFocus={() => setActiveField("destination")}
            onClear={() => handleClear("destination")}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="swap-button size-8 text-primary"
          onClick={handleSwap}
        >
          <IconArrowsUpDown className="size-4.5" />
        </Button>
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
