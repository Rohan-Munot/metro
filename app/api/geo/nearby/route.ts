import { NextRequest, NextResponse } from "next/server"
import { metroFetch } from "@/app/api/metro/fetch"
import type { NearbyStation, Station } from "@/lib/types"

const GEO_API_KEY = process.env.GEO_API

// Haversine distance in metres between two lat/lng points
function haversineMetres(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function findDmrcStation(name: string): Promise<Station | null> {
  try {
    const res = await metroFetch(
      `/station_by_keyword/all/${encodeURIComponent(name)}`
    )
    if (!res.ok) return null
    const data: unknown = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null

    // Normalise the search name for fuzzy matching
    const normalised = name.toLowerCase().replace(/\s+/g, " ").trim()

    // Try exact name match first, then partial
    const exact = (data as Station[]).find(
      (s) => s.station_name.toLowerCase() === normalised
    )
    if (exact) return exact

    const partial = (data as Station[]).find((s) =>
      s.station_name.toLowerCase().includes(normalised.split(" ")[0])
    )
    return partial ?? (data as Station[])[0]
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "")
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") ?? "")

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 })
  }

  if (!GEO_API_KEY) {
    return NextResponse.json(
      { error: "GEO_API not configured" },
      { status: 500 }
    )
  }

  // Search for subway stations within 3km using Geoapify Places API
  const url =
    `https://api.geoapify.com/v2/places` +
    `?categories=public_transport.subway` +
    `&filter=circle:${lng},${lat},3000` +
    `&limit=8` +
    `&apiKey=${GEO_API_KEY}`

  const res = await fetch(url, {
    headers: { "User-Agent": "metro-delhi-app" },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Places lookup failed" }, { status: 502 })
  }

  const data = await res.json()
  const features: Array<{
    properties: { name?: string }
    geometry: { coordinates: [number, number] }
  }> = data?.features ?? []

  if (features.length === 0) {
    return NextResponse.json([])
  }

  // Cross-reference each nearby station against DMRC
  const results: NearbyStation[] = await Promise.all(
    features.map(async (f) => {
      const name = f.properties.name ?? "Unknown Station"
      const stationLng = f.geometry.coordinates[0]
      const stationLat = f.geometry.coordinates[1]
      const distance_m = Math.round(
        haversineMetres(lat, lng, stationLat, stationLng)
      )

      const dmrcStation = await findDmrcStation(name)

      return {
        source: dmrcStation ? "dmrc" : "google-only",
        station: dmrcStation,
        name,
        distance_m,
        lat: stationLat,
        lng: stationLng,
      } satisfies NearbyStation
    })
  )

  // Sort by distance ascending
  results.sort((a, b) => a.distance_m - b.distance_m)

  return NextResponse.json(results)
}
