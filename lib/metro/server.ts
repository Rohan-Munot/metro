import { metroFetch } from "@/app/api/metro/fetch"
import type { Station } from "@/lib/types"

export async function fetchStationByNameServer(
  name: string
): Promise<Station | null> {
  try {
    const res = await metroFetch(
      `/station_by_keyword/all/${encodeURIComponent(name)}`
    )
    const data: Station[] = await res.json()

    if (!Array.isArray(data) || data.length === 0) return null

    const normalizedName = name.toUpperCase()
    return (
      data.find((s) => s.station_name.toUpperCase() === normalizedName) ??
      data[0]
    )
  } catch {
    return null
  }
}
