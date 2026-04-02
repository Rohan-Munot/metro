import { IconArrowsExchange } from "@tabler/icons-react"

/* ------------------------------------------------------------------ */
/*  Interchange badge — shown between journey segments at transfers     */
/* ------------------------------------------------------------------ */

interface InterchangeBadgeProps {
  minutes: number
}

export function InterchangeBadge({ minutes }: InterchangeBadgeProps) {
  return (
    <div className="flex items-center gap-3 border-y border-dashed border-border px-1 py-3">
      <IconArrowsExchange
        size={16}
        className="shrink-0 text-muted-foreground"
      />
      <span className="font-sans text-sm tracking-wide text-muted-foreground">
        Change here{" "}
        <span className="font-mono text-xs text-muted-foreground/70">
          &middot; {minutes} min
        </span>
      </span>
    </div>
  )
}
