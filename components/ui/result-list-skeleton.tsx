interface ResultListSkeletonProps {
  "aria-label": string
  className?: string
  itemClassName?: string
  count?: number
}

export function ResultListSkeleton({
  "aria-label": ariaLabel,
  className = "flex flex-col gap-2",
  itemClassName = "h-16 rounded-md border border-border bg-muted/60",
  count = 3,
}: ResultListSkeletonProps) {
  return (
    <div className={className} role="status" aria-label={ariaLabel}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${itemClassName} animate-pulse motion-reduce:animate-none`}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  )
}
