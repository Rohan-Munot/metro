import { Suspense, use } from "react"
import { SearchContainer } from "@/components/containers/search"
import { fetchStationByNameServer } from "@/lib/metro/server"
import type { Station } from "@/lib/types"

async function ResolvedSearchContainer({
  originPromise,
  destinationPromise,
}: {
  originPromise: Promise<Station | null>
  destinationPromise: Promise<Station | null>
}) {
  const [initialOrigin, initialDestination] = await Promise.all([
    originPromise,
    destinationPromise,
  ])

  return (
    <SearchContainer
      initialOrigin={initialOrigin}
      initialDestination={initialDestination}
    />
  )
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string; destination?: string }>
}) {
  const resolvedParams = use(searchParams)
  const { origin, destination } = resolvedParams

  const originPromise = origin
    ? fetchStationByNameServer(origin)
    : Promise.resolve(null)
  const destinationPromise = destination
    ? fetchStationByNameServer(destination)
    : Promise.resolve(null)

  return (
    <div className="flex h-svh flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 overflow-hidden">
        <header>
          <h1 className="text-center text-lg font-semibold">Search stations</h1>
        </header>
        <Suspense
          fallback={
            <div
              className="h-56 animate-pulse rounded-md border border-border bg-muted/60"
              aria-hidden="true"
            />
          }
        >
          <ResolvedSearchContainer
            originPromise={originPromise}
            destinationPromise={destinationPromise}
          />
        </Suspense>
      </div>
    </div>
  )
}
