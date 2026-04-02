export function LoadingSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      role="status"
      aria-label="Loading route"
    >
      <div className="h-10 animate-pulse rounded-md bg-muted/30" />
      <div
        className="h-32 animate-pulse rounded-md bg-muted/30"
        style={{ animationDelay: "100ms" }}
      />
      <div
        className="h-24 animate-pulse rounded-md bg-muted/30"
        style={{ animationDelay: "200ms" }}
      />
    </div>
  )
}
