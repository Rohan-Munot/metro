import { IconArrowsExchange, IconWalk } from "@tabler/icons-react"

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
      <div className="font-sans text-sm tracking-wide text-muted-foreground flex justify-between w-full items-center">
        <span>Change here</span>
        <div className="font-mono text-xs text-muted-foreground/70 flex items-center gap-1">
          <IconWalk  className="inline-block size-4" />
         {minutes} min
        </div>
      </div>
    </div>
  )
}
