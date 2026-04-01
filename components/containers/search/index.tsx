"use client"

import { IconArrowsUpDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SearchField } from "./search-field"
import { useState } from "react"
import { SearchResultContainer } from "../search-result"
import { RouteResultContainer } from "../route-result"
import { useStationSearch } from "@/hooks/use-station-search"
import { useRouteSearch } from "@/hooks/use-route-search"
import { titleCase } from "@/lib/utils"
import type { Station, RouteType } from "@/lib/types"

type ActiveField = "origin" | "destination"

export const SearchContainer = () => {
  const [originQuery, setOriginQuery] = useState("")
  const [destinationQuery, setDestinationQuery] = useState("")
  const [activeField, setActiveField] = useState<ActiveField>("origin")

  const [selectedOrigin, setSelectedOrigin] = useState<Station | null>(null)
  const [selectedDestination, setSelectedDestination] =
    useState<Station | null>(null)

  const [routeType, setRouteType] = useState<RouteType>("least-distance")

  // Only search when the active field has no selection
  const isSearching =
    (activeField === "origin" && !selectedOrigin) ||
    (activeField === "destination" && !selectedDestination)

  const activeQuery = isSearching
    ? activeField === "origin"
      ? originQuery
      : destinationQuery
    : ""

  const { stations, isLoading, hasSearched } = useStationSearch(activeQuery)

  const bothSelected = !!selectedOrigin && !!selectedDestination
  const { route, isLoading: routeLoading } = useRouteSearch(
    selectedOrigin?.station_code ?? null,
    selectedDestination?.station_code ?? null,
    routeType
  )

  const handleSelect = (station: Station) => {
    if (activeField === "origin") {
      setSelectedOrigin(station)
      setOriginQuery(titleCase(station.station_name))
      // Auto-advance to destination if not yet selected
      if (!selectedDestination) {
        setActiveField("destination")
      }
    } else {
      setSelectedDestination(station)
      setDestinationQuery(titleCase(station.station_name))
    }
  }

  const handleOriginClear = () => {
    setOriginQuery("")
    setSelectedOrigin(null)
  }

  const handleDestinationClear = () => {
    setDestinationQuery("")
    setSelectedDestination(null)
  }

  const handleOriginChange = (value: string) => {
    setOriginQuery(value)
    setSelectedOrigin(null)
  }

  const handleDestinationChange = (value: string) => {
    setDestinationQuery(value)
    setSelectedDestination(null)
  }

  const handleSwap = () => {
    setOriginQuery(destinationQuery)
    setDestinationQuery(originQuery)
    setSelectedOrigin(selectedDestination)
    setSelectedDestination(selectedOrigin)
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-col gap-2">
          <SearchField
            placeholder="Select origin"
            value={originQuery}
            onChange={handleOriginChange}
            onFocus={() => setActiveField("origin")}
            onClear={handleOriginClear}
          />
          <SearchField
            placeholder="Select destination"
            value={destinationQuery}
            onChange={handleDestinationChange}
            onFocus={() => setActiveField("destination")}
            onClear={handleDestinationClear}
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
            routeType={routeType}
            onRouteTypeChange={setRouteType}
          />
        ) : (
          <SearchResultContainer
            stations={stations}
            query={activeQuery}
            isLoading={isLoading}
            hasSearched={hasSearched}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  )
}
