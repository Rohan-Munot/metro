import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./use-debounce"
import { fetchStations } from "@/lib/metro/client"

export function useStationSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 300)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["station-search", debouncedQuery],
    queryFn: () => fetchStations(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    placeholderData: (prev) => prev,
  })

  const isTyping = query.trim() !== "" && query.trim() !== debouncedQuery

  return {
    stations: data ?? [],
    isLoading: isLoading || isFetching || isTyping,
    hasSearched: debouncedQuery.length > 0 && !isLoading && !isTyping,
  }
}
