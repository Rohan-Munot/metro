import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./use-debounce"
import type { GeocodeResult } from "@/lib/types"

async function fetchGeocode(q: string): Promise<GeocodeResult | null> {
  const res = await fetch(`/api/geo/geocode?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error("Geocoding failed")
  return res.json()
}

export function useGeocode(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 600)

  const { data, isLoading } = useQuery({
    queryKey: ["geocode", debouncedQuery],
    queryFn: () => fetchGeocode(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 10 * 60 * 1000,
  })

  return {
    geocode: data ?? null,
    isLoading,
  }
}
