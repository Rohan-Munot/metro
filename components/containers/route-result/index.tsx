import type { RouteResult, RouteType } from "@/lib/types"
import { LoadingSkeleton } from "./loading-skeleton"
import { ErrorState } from "./error-state"
import { RouteTypeToggle } from "./route-type-toggle"
import { SummaryCard } from "./summary-card"
import { JourneySegment } from "./journey-segment"

interface RouteResultContainerProps {
  route: RouteResult | null
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  routeType: RouteType
  onRouteTypeChange: (type: RouteType) => void
}

export function RouteResultContainer({
  route,
  isLoading,
  error,
  onRetry,
  routeType,
  onRouteTypeChange,
}: RouteResultContainerProps) {
  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorState onRetry={onRetry} />
  if (!route) return null

  return (
    <div className="mx-auto flex w-full max-w-md animate-in flex-col bg-background px-4 py-2 duration-300 fill-mode-both fade-in slide-in-from-bottom-2">
      <div className="flex w-full flex-col">
        <RouteTypeToggle
          routeType={routeType}
          onRouteTypeChange={onRouteTypeChange}
        />

        <div className="w-full">
          <SummaryCard route={route} />
        </div>

        <div className="flex flex-col gap-0 pt-2 pb-12">
          {route.route.map((leg, i) => (
            <div
              key={`${leg.line_no}-${leg.start}`}
              className="animate-in fill-mode-both fade-in"
              style={{ animationDelay: `${50 + i * 50}ms` }}
            >
              <JourneySegment
                leg={leg}
                isFirst={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
