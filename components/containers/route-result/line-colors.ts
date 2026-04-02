/* ------------------------------------------------------------------ */
/*  Metro line color tokens                                            */
/*  Maps line_no (1–12) → Tailwind class strings                       */
/* ------------------------------------------------------------------ */

export const LINE_BG: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-yellow-400",
  3: "bg-blue-500",
  4: "bg-blue-300",
  5: "bg-green-500",
  6: "bg-violet-500",
  7: "bg-pink-400",
  8: "bg-fuchsia-600",
  9: "bg-gray-400",
  10: "bg-orange-400",
  11: "bg-emerald-500",
  12: "bg-sky-400",
}

export const LINE_BORDER: Record<number, string> = {
  1: "border-red-500",
  2: "border-yellow-400",
  3: "border-blue-500",
  4: "border-blue-300",
  5: "border-green-500",
  6: "border-violet-500",
  7: "border-pink-400",
  8: "border-fuchsia-600",
  9: "border-gray-400",
  10: "border-orange-400",
  11: "border-emerald-500",
  12: "border-sky-400",
}

export const LINE_TEXT: Record<number, string> = {
  1: "text-red-500",
  2: "text-yellow-500",
  3: "text-blue-500",
  4: "text-blue-400",
  5: "text-green-600",
  6: "text-violet-500",
  7: "text-pink-400",
  8: "text-fuchsia-600",
  9: "text-gray-500",
  10: "text-orange-500",
  11: "text-emerald-500",
  12: "text-sky-500",
}

/** Convenience: get all three color classes for a given line number */
export function getLineColors(lineNo: number) {
  return {
    bg: LINE_BG[lineNo] ?? "bg-muted-foreground",
    border: LINE_BORDER[lineNo] ?? "border-muted-foreground",
    text: LINE_TEXT[lineNo] ?? "text-muted-foreground",
  } as const
}
