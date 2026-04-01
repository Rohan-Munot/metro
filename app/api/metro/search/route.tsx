import { NextRequest, NextResponse } from "next/server";
import { metroFetch } from "../fetch";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const res = await metroFetch(`/station_by_keyword/all/${encodeURIComponent(query)}`);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
