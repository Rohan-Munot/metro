export function formatTime(time: string): string {
  const parts = time.split(":").map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`
  if (hours > 0) return `${hours} hr`
  return `${minutes} min`
}

export function formatClockTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const hour = h ?? 0
  const minute = m ?? 0
  const period = hour >= 12 ? "PM" : "AM"
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`
}

export function addTime(clock: string, duration: string): string {
  const [ch, cm, cs] = clock.split(":").map(Number)
  const [dh, dm, ds] = duration.split(":").map(Number)
  let totalSec =
    (ch ?? 0) * 3600 +
    (cm ?? 0) * 60 +
    (cs ?? 0) +
    ((dh ?? 0) * 3600 + (dm ?? 0) * 60 + (ds ?? 0))
  totalSec = ((totalSec % 86400) + 86400) % 86400

  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)} km`
}
