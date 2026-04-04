import { NextRequest, NextResponse } from "next/server"
import { metroFetch } from "../fetch"
import type { Station } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const dmrcRes = await metroFetch(
      `/station_by_keyword/all/${encodeURIComponent(query)}`
    )
    const dmrcData: Station[] = await dmrcRes.json()
    return NextResponse.json(dmrcData)
  } catch {
    return NextResponse.json(
      { error: "Search service temporarily unavailable" },
      { status: 502 }
    )
  }
}
