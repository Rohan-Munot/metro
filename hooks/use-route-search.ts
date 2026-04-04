import { useQuery } from "@tanstack/react-query"
import type { RouteType } from "@/lib/types"
import { fetchRoute } from "@/lib/metro/client"

export function useRouteSearch(
  fromCode: string | null,
  toCode: string | null,
  type: RouteType
) {
  const enabled = !!fromCode && !!toCode

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["station-route", fromCode, toCode, type],
    queryFn: () => fetchRoute(fromCode!, toCode!, type),
    enabled,
  })

  return {
    route: data ?? null,
    isLoading: isLoading || isFetching,
    error,
    hasResult: enabled && !isLoading && !!data,
  }
}
