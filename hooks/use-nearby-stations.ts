import { useQuery } from "@tanstack/react-query"
import type { NearbyStation } from "@/lib/types"

async function fetchNearbyStations(
  lat: number,
  lng: number
): Promise<NearbyStation[]> {
  const res = await fetch(`/api/geo/nearby?lat=${lat}&lng=${lng}`)
  if (!res.ok) throw new Error("Failed to fetch nearby stations")
  return res.json()
}

export function useNearbyStations(lat: number | null, lng: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nearby-stations", lat, lng],
    queryFn: () => fetchNearbyStations(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000,
  })

  return {
    nearbyStations: data ?? [],
    isLoading,
    error,
  }
}
