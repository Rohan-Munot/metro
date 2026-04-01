"use client"

import { useState, useEffect, useCallback, useRef, forwardRef } from "react"
import { StationList } from "./station-list"
import { Button } from "./ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import type { Station } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  IconArrowsExchange,
  IconX,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react"

export type ActiveField = "from" | "to"

function titleCase(str: string) {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

export function MetroSearch() {
  const [fromQuery, setFromQuery] = useState("")
  const [toQuery, setToQuery] = useState("")
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [fromStation, setFromStation] = useState<Station | null>(null)
  const [toStation, setToStation] = useState<Station | null>(null)
  const [activeField, setActiveField] = useState<ActiveField>("from")

  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)

  const activeQuery = activeField === "from" ? fromQuery : toQuery
  const debouncedQuery = useDebounce(activeQuery, 300)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setStations([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/metro/search?q=${encodeURIComponent(q.trim())}`
      )
      if (res.ok) {
        const data = await res.json()
        setStations(Array.isArray(data) ? data : [])
      } else {
        setStations([])
      }
      setHasSearched(true)
    } catch {
      setStations([])
      setHasSearched(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  const bothSelected = fromStation !== null && toStation !== null

  function resetSearch() {
    setStations([])
    setHasSearched(false)
  }

  function handleSelectStation(station: Station) {
    if (activeField === "from") {
      setFromStation(station)
      setFromQuery("")
      resetSearch()
      if (!toStation) {
        setActiveField("to")
        setTimeout(() => toInputRef.current?.focus(), 50)
      }
    } else {
      setToStation(station)
      setToQuery("")
      resetSearch()
    }
  }

  function handleSwap() {
    setFromStation(toStation)
    setToStation(fromStation)
  }

  function handleClearField(field: ActiveField) {
    if (field === "from") {
      setFromStation(null)
      setFromQuery("")
      setActiveField("from")
      resetSearch()
      setTimeout(() => fromInputRef.current?.focus(), 50)
    } else {
      setToStation(null)
      setToQuery("")
      setActiveField("to")
      resetSearch()
      setTimeout(() => toInputRef.current?.focus(), 50)
    }
  }

  function handleFieldFocus(field: ActiveField) {
    setActiveField(field)
    resetSearch()
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Trip planner card */}
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-stretch gap-2">

          {/* From / To fields */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <SearchSlot
              ref={fromInputRef}
              placeholder="Select origin"
              station={fromStation}
              query={fromQuery}
              onQueryChange={setFromQuery}
              isActive={activeField === "from" && !bothSelected}
              isLoading={isLoading && activeField === "from"}
              onFocus={() => handleFieldFocus("from")}
              onClear={() => handleClearField("from")}
            />
            <SearchSlot
              ref={toInputRef}
              placeholder="Select destination"
              station={toStation}
              query={toQuery}
              onQueryChange={setToQuery}
              isActive={activeField === "to" && !bothSelected}
              isLoading={isLoading && activeField === "to"}
              onFocus={() => handleFieldFocus("to")}
              onClear={() => handleClearField("to")}
            />
          </div>

          {/* Swap button */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleSwap}
              disabled={!fromStation && !toStation}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border border-border",
                "text-muted-foreground transition-colors duration-150",
                "hover:bg-accent hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:pointer-events-none disabled:opacity-30",
                "touch-manipulation"
              )}
              aria-label="Swap origin and destination"
            >
              <IconArrowsExchange className="size-5 rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results / guidance */}
      {!bothSelected ? (
        <StationList
          stations={stations}
          query={debouncedQuery}
          isLoading={isLoading}
          hasSearched={hasSearched}
          activeField={activeField}
          onSelect={handleSelectStation}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Both stations selected
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            Route planning coming soon
          </p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface SearchSlotProps {
  placeholder: string
  station: Station | null
  query: string
  onQueryChange: (value: string) => void
  isActive: boolean
  isLoading: boolean
  onFocus: () => void
  onClear: () => void
}

const SearchSlot = forwardRef<HTMLInputElement, SearchSlotProps>(
  function SearchSlot(
    {
      placeholder,
      station,
      query,
      onQueryChange,
      isActive,
      isLoading,
      onFocus,
      onClear,
    },
    ref
  ) {
    return (
      <div
        className={cn(
          "group flex h-12 p-3 items-center rounded-md border text-sm",
          "transition-colors duration-150",
          isActive
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-background"
        )}
      >
        {/* Search / loading icon */}
        <div className="flex shrink-0 items-center">
          {isLoading ? (
            <IconLoader2
              className="animate-spin text-primary motion-reduce:animate-none size-4"
              aria-hidden="true"
            />
          ) : (
            <IconSearch
              className={cn(
                "transition-colors duration-150 size-4",
                isActive ? "text-primary" : "text-muted-foreground/40"
              )}
              aria-hidden="true"
            />
          )}
        </div>

        {station ? (
          /* Selected station display */
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClear}
            className={cn(
              "h-auto min-w-0 flex-1 truncate px-2 justify-start text-foreground",
              "touch-manipulation"
            )}
          >
            {titleCase(station.station_name)}
          </Button>
        ) : (
          /* Search input */
          <input
            ref={ref}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "min-w-0 flex-1 bg-transparent px-2 text-sm tracking-wide",
              "placeholder:text-muted-foreground/50",
              "outline-none",
              "touch-manipulation"
            )}
          />
        )}

        {/* Clear button */}
        {(station || query) && (
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            onClick={() => {
              if (station) {
                onClear()
              } else {
                onQueryChange("")
              }
            }}
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-sm ml-2",
              "text-muted-foreground/40 transition-colors duration-150 hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              "touch-manipulation"
            )}
            aria-label="Clear"
          >
            <IconX className="size-4" />
          </Button>
        )}
      </div>
    )
  }
)
