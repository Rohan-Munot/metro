import type { RouteType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { IconRoute, IconTransfer } from "@tabler/icons-react"

interface RouteTypeToggleProps {
  routeType: RouteType
  onRouteTypeChange: (type: RouteType) => void
}

export function RouteTypeToggle({
  routeType,
  onRouteTypeChange,
}: RouteTypeToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
      <button
        type="button"
        onClick={() => onRouteTypeChange("least-distance")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 font-sans text-xs font-medium tracking-wide transition-colors",
          routeType === "least-distance"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <IconRoute size={14} />
        Shortest
      </button>
      <button
        type="button"
        onClick={() => onRouteTypeChange("minimum-interchange")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 font-sans text-xs font-medium tracking-wide transition-colors",
          routeType === "minimum-interchange"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <IconTransfer size={14} />
        Min. Interchange
      </button>
    </div>
  )
}
