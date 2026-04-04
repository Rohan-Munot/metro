import type { RouteResult, RouteType, Station } from "@/lib/types"

async function fetchJson<T>(input: string): Promise<T> {
  const res = await fetch(input)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

function isStation(value: unknown): value is Station {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Station).id === "number" &&
    typeof (value as Station).station_name === "string" &&
    typeof (value as Station).station_code === "string" &&
    Array.isArray((value as Station).station_facility)
  )
}

function isRouteResult(value: unknown): value is RouteResult {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as RouteResult).from === "string" &&
    typeof (value as RouteResult).to === "string" &&
    Array.isArray((value as RouteResult).route) &&
    typeof (value as RouteResult).total_time === "string"
  )
}

export async function fetchStations(query: string): Promise<Station[]> {
  const data = await fetchJson<unknown>(
    `/api/metro/search?q=${encodeURIComponent(query)}`
  )

  if (!Array.isArray(data) || !data.every(isStation)) {
    throw new Error("Invalid station search response")
  }

  return data
}

export async function fetchStationByCode(code: string): Promise<Station | null> {
  const stations = await fetchStations(code)
  if (stations.length === 0) {
    return null
  }

  const normalizedCode = code.toUpperCase()
  return (
    stations.find((station) => station.station_code.toUpperCase() === normalizedCode) ??
    stations[0]
  )
}

export async function fetchRoute(
  from: string,
  to: string,
  type: RouteType
): Promise<RouteResult> {
  const params = new URLSearchParams({ from, to, type })
  const data = await fetchJson<unknown>(`/api/metro/route?${params}`)
  if (!isRouteResult(data)) {
    throw new Error("Invalid route response")
  }
  return data
}
