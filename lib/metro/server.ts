import { metroFetch } from "@/app/api/metro/fetch"
import type { Station } from "@/lib/types"

export async function fetchStationByNameServer(
  name: string
): Promise<Station | null> {
  try {
    const res = await metroFetch(
      `/station_by_keyword/all/${encodeURIComponent(name)}`
    )
    if (!res.ok) return null

    const data: Station[] = await res.json()

    if (!Array.isArray(data) || data.length === 0) return null

    const normalizedName = name.toLowerCase().replace(/\s+/g, " ").trim()
    const firstToken = normalizedName.split(" ")[0]

    return (
      data.find(
        (station) => station.station_name.toLowerCase() === normalizedName
      ) ??
      data.find((station) =>
        station.station_name.toLowerCase().includes(firstToken)
      ) ??
      data[0]
    )
  } catch {
    return null
  }
}
