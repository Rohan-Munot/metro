import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({
  message = "Couldn't load route. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <IconAlertCircle
        size={32}
        strokeWidth={1.5}
        className="text-destructive/60"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
        <IconRefresh className="size-3.5" />
        Try again
      </Button>
    </div>
  )
}
