import { format } from './messages/format'
import { useSignUpSheetContext } from './state/context'

export type SheetHeaderProps = {
  /** Sheet title — rendered as the primary `<h1>`. */
  title: string
  /** Optional supporting copy below the title. */
  description?: string
  /** Optional extra classes applied to the header element. */
  className?: string
}

export function SheetHeader({
  title,
  description,
  className
}: SheetHeaderProps) {
  const { messages, timeZone } = useSignUpSheetContext()

  return (
    <header
      data-sheet-header
      className={`flex flex-col gap-1 border-b border-border bg-headline px-4 py-4 text-headline-fg ${className ?? ''}`}
    >
      <h1 className="text-lg font-semibold">{title}</h1>
      {description ? <p className="text-sm opacity-90">{description}</p> : null}
      {timeZone ? (
        <p data-sheet-header-timezone className="text-xs opacity-75">
          {format(messages.timeZoneNote, { timeZone })}
        </p>
      ) : null}
    </header>
  )
}
