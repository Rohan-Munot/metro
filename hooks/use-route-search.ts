import { useQuery } from "@tanstack/react-query"
import type { RouteResult, RouteType } from "@/lib/types"

async function fetchRoute(
  from: string,
  to: string,
  type: RouteType
): Promise<RouteResult> {
  const params = new URLSearchParams({ from, to, type })
  const res = await fetch(`/api/metro/route?${params}`)
  if (!res.ok) throw new Error(`Route fetch failed: ${res.status}`)
  return res.json()
}

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
