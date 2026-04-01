import { NextRequest, NextResponse } from "next/server"
import { metroFetch } from "../fetch"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")?.trim()
  const to = searchParams.get("to")?.trim()
  const type = searchParams.get("type")?.trim()

  if (!from || !to) {
    return NextResponse.json(
      { error: "Both 'from' and 'to' station codes are required" },
      { status: 400 }
    )
  }

  const routeType =
    type === "minimum-interchange" ? "minimum-interchange" : "least-distance"

  // Backend expects ISO timestamp without trailing "Z"
  const now = new Date().toISOString().replace("Z", "")
  const path = `/station_route/${from}/${to}/${routeType}/${now}`

  try {
    const res = await metroFetch(path)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch route from upstream" },
      { status: 502 }
    )
  }
}
