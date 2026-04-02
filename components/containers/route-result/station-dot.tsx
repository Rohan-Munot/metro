import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Station dot — the circle marker on the timeline rail               */
/* ------------------------------------------------------------------ */

type StationDotProps =
  | {
      /** Small intermediate dot — only needs a fill color */
      small: true
      fillColor: string
      borderColor?: never
      filled?: never
    }
  | {
      /** Standard station dot with a bordered ring */
      small?: false
      borderColor: string
      filled?: boolean
      fillColor?: string
    }

export function StationDot(props: StationDotProps) {
  if (props.small) {
    return (
      <span
        className={cn(
          "block h-1.5 w-1.5 shrink-0 rounded-full",
          props.fillColor
        )}
      />
    )
  }

  return (
    <span
      className={cn(
        "block h-3.5 w-3.5 shrink-0 rounded-full border-[2.5px]",
        props.borderColor,
        props.filled ? props.fillColor : "bg-background"
      )}
    />
  )
}
