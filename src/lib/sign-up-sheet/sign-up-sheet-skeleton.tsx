import { useSignUpSheetContext } from './state/context'

export type SignUpSheetSkeletonProps = {
  rowCount?: number
  className?: string
}

export function SignUpSheetSkeleton({
  rowCount = 3,
  className
}: SignUpSheetSkeletonProps) {
  const { messages } = useSignUpSheetContext()
  const rows = Array.from(
    { length: Math.max(1, rowCount) },
    (_, i) => `skeleton-row-${String(i)}`
  )

  return (
    <div
      data-sign-up-sheet-skeleton
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={`flex flex-col gap-3 ${className ?? ''}`}
    >
      <span className="sr-only">{messages.loadingSheet}</span>
      <div className="flex flex-col gap-2 border-b border-border bg-headline px-4 py-4">
        <div
          data-skeleton-bar
          className="h-5 w-2/3 animate-pulse rounded bg-headline-fg/30"
        />
        <div
          data-skeleton-bar
          className="h-3 w-1/2 animate-pulse rounded bg-headline-fg/20"
        />
      </div>
      <ul
        data-skeleton-rows
        className="m-0 list-none divide-y divide-border rounded-lg border border-border bg-surface-elevated p-0"
      >
        {rows.map(rowKey => (
          <li
            key={rowKey}
            data-skeleton-row
            className="grid gap-3 px-4 py-3 md:grid-cols-4"
          >
            <div className="h-4 w-3/4 animate-pulse rounded bg-fg/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-fg/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-fg/10" />
            <div className="h-8 w-24 animate-pulse rounded bg-fg/10" />
          </li>
        ))}
      </ul>
    </div>
  )
}
