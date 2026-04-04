import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  IconAlertTriangle,
  IconArrowsExchange,
  IconElevator,
  IconParking,
  IconWheelchair,
} from "@tabler/icons-react"
import type { ComponentType } from "react"
import { titleCase } from "@/lib/formatters"
import type { NearbyStation, Station } from "@/lib/types"

const facilityMap: Record<
  string,
  { icon: ComponentType<{ size?: number }>; label: string }
> = {
  "flaticon-disabled": { icon: IconWheelchair, label: "Accessible" },
  "flaticon-parking-area": { icon: IconParking, label: "Parking" },
  "flaticon-elevator": { icon: IconElevator, label: "Lift" },
  "flaticon-exchange": { icon: IconArrowsExchange, label: "Interchange" },
}

function formatDistance(metres: number): string {
  if (metres < 1000) return `${metres} m`
  return `${(metres / 1000).toFixed(1)} km`
}

interface NearbyStationCardProps {
  nearby: NearbyStation
  index: number
  onSelect: (station: Station) => void
}

export function NearbyStationCard({
  nearby,
  index,
  onSelect,
}: NearbyStationCardProps) {
  const isDmrc = nearby.source === "dmrc" && nearby.station !== null
  const station = nearby.station

  const distanceBadge = (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-sm px-1.5 py-0.5",
        "text-[10px] tracking-wide",
        isDmrc ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      {formatDistance(nearby.distance_m)}
    </span>
  )

  if (!isDmrc) {
    // Non-DMRC station — show warning, not selectable
    return (
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md border border-amber-500/30 bg-card p-3",
          "animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
        )}
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-10 w-12 shrink-0 items-center justify-center rounded-sm",
              "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              "text-[10px] font-bold tracking-widest"
            )}
          >
            N/A
          </div>
          <div className="min-w-0 flex-1 py-0.5">
            <span className="block truncate text-sm font-medium tracking-wide">
              {titleCase(nearby.name)}
            </span>
          </div>
          {distanceBadge}
        </div>
        <div className="flex items-start gap-1.5 rounded-sm bg-amber-500/10 px-2.5 py-2">
          <IconAlertTriangle
            size={12}
            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
            Not managed by DMRC — route planning unavailable from this station.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => onSelect(station!)}
      className={cn(
        "group h-auto w-full justify-start rounded-md border border-border bg-card p-3 text-left",
        "transition-colors duration-150",
        "hover:border-primary/30 hover:bg-accent/50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
        "active:bg-accent/70",
        "touch-manipulation",
        "animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <div
        className={cn(
          "flex h-10 w-12 shrink-0 items-center justify-center rounded-sm",
          "bg-primary/10 text-primary",
          "text-[11px] font-bold tracking-widest",
          "transition-colors duration-150 group-hover:bg-primary/15"
        )}
      >
        {station!.station_code}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <span className="block truncate text-sm font-medium tracking-wide">
          {titleCase(station!.station_name)}
        </span>

        {station!.station_facility.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {station!.station_facility.map((facility) => {
              const config = facilityMap[facility.class_name]
              if (!config) return null
              const Icon = config.icon
              return (
                <span
                  key={facility.class_name}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5",
                    "bg-muted text-muted-foreground",
                    "text-[10px] tracking-wide"
                  )}
                >
                  <Icon size={11} />
                  {config.label}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {distanceBadge}
    </Button>
  )
}
