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
    <div className="flex w-full items-center rounded-md border border-border/80 bg-muted/20 p-1">
      <button
        type="button"
        onClick={() => onRouteTypeChange("least-distance")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded py-2 transition-all",
          "font-sans text-sm font-semibold tracking-wide",
          routeType === "least-distance"
            ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-border/50"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <IconRoute size={14} stroke={2} />
        Shortest Path
      </button>

      <button
        type="button"
        onClick={() => onRouteTypeChange("minimum-interchange")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded py-2 transition-all",
          "font-sans text-sm font-semibold tracking-wide",
          routeType === "minimum-interchange"
            ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-border/50"
            : "bg-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        <IconTransfer size={14} stroke={2} />
        Min. Interchange
      </button>
    </div>
  )
}
