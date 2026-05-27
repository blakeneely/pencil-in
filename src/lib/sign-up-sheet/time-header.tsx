export type TimeHeaderProps = {
  /** Pre-formatted time string for the sub-group (e.g. `'9:00 AM'`). */
  time: string
  /** Optional location suffix rendered after a separator dot. */
  location?: string
  /** Optional extra classes applied to the header. */
  className?: string
}

export function TimeHeader({ time, location, className }: TimeHeaderProps) {
  return (
    <div
      data-time-header
      className={`mt-3 flex flex-wrap items-baseline gap-2 px-4 text-sm font-medium text-headline first:mt-0 ${className ?? ''}`}
    >
      <span>{time}</span>
      {location ? <span className="text-fg-muted">· {location}</span> : null}
    </div>
  )
}
