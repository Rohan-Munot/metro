import { cn } from "@/lib/utils"
import type { Station } from "@/lib/types"
import { Button } from "./ui/button"
import {
  IconWheelchair,
  IconParking,
  IconElevator,
  IconArrowsExchange,
} from "@tabler/icons-react"
import type { ComponentType } from "react"

const facilityMap: Record<
  string,
  { icon: ComponentType<{ size?: number }>; label: string }
> = {
  "flaticon-disabled": { icon: IconWheelchair, label: "Accessible" },
  "flaticon-parking-area": { icon: IconParking, label: "Parking" },
  "flaticon-elevator": { icon: IconElevator, label: "Lift" },
  "flaticon-exchange": { icon: IconArrowsExchange, label: "Interchange" },
}

function titleCase(str: string) {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

interface StationCardProps {
  station: Station
  index: number
  onSelect: (station: Station) => void
}

export function StationCard({ station, index, onSelect }: StationCardProps) {
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => onSelect(station)}
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
        {station.station_code}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <span className="block truncate text-sm font-medium tracking-wide">
          {titleCase(station.station_name)}
        </span>

        {station.station_facility.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {station.station_facility.map((facility) => {
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
    </Button>
  )
}
