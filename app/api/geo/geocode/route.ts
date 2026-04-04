import { NextRequest, NextResponse } from "next/server"
import type { GeocodeResult } from "@/lib/types"

const GEO_API_KEY = process.env.GEO_API

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  if (!GEO_API_KEY) {
    return NextResponse.json(
      { error: "GEO_API not configured" },
      { status: 500 }
    )
  }

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(q)}&limit=1&apiKey=${GEO_API_KEY}`

  const res = await fetch(url, {
    headers: { "User-Agent": "metro-delhi-app" },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 })
  }

  const data = await res.json()
  const feature = data?.features?.[0]

  if (!feature) {
    return NextResponse.json(null)
  }

  const result: GeocodeResult = {
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    formatted_address: feature.properties.formatted,
  }

  return NextResponse.json(result)
}
