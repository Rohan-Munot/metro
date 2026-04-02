import type { RouteResult, RouteType } from "@/lib/types"
import { LoadingSkeleton } from "./loading-skeleton"
import { RouteTypeToggle } from "./route-type-toggle"
import { SummaryCard } from "./summary-card"
import { JourneySegment } from "./journey-segment"

interface RouteResultContainerProps {
  route: RouteResult | null
  isLoading: boolean
  routeType: RouteType
  onRouteTypeChange: (type: RouteType) => void
}

export function RouteResultContainer({
  route,
  isLoading,
  routeType,
  onRouteTypeChange,
}: RouteResultContainerProps) {
  if (isLoading) return <LoadingSkeleton />
  if (!route) return null

  return (
    <div className="flex flex-col gap-4">
      <RouteTypeToggle
        routeType={routeType}
        onRouteTypeChange={onRouteTypeChange}
      />

      <SummaryCard route={route} />

      <div className="flex flex-col gap-2 pb-4">
        {route.route.map((leg, i) => (
          <JourneySegment
            key={`${leg.line_no}-${leg.start}`}
            leg={leg}
            isFirst={i === 0}
            isLast={i === route.route.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
