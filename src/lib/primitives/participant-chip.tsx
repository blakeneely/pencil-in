import { Avatar } from './avatar'
import type { Participant } from './types'

export type ParticipantChipProps = {
  /** The person to render. */
  participant: Participant
  /**
   * When true, the chip is highlighted with the accent ring, shows the
   * `youLabel` instead of the real name, and announces `aria-current`.
   */
  isCurrent?: boolean
  /**
   * Visible label that replaces the participant's name when `isCurrent`.
   * Default `'You'`. Useful for i18n (e.g. `'Tú'`).
   */
  youLabel?: string
  /** Optional extra classes applied to the chip. */
  className?: string
}

export function ParticipantChip({
  participant,
  isCurrent = false,
  youLabel = 'You',
  className
}: ParticipantChipProps) {
  const quantity = participant.quantity ?? 1
  const quantitySuffix = quantity > 1 ? ` (${String(quantity)})` : ''
  const visibleName = isCurrent
    ? `${youLabel}${quantitySuffix}`
    : `${participant.name}${quantitySuffix}`
  const fullName = `${participant.name}${quantitySuffix}`

  const tone = isCurrent
    ? 'bg-accent/15 text-accent ring-1 ring-accent'
    : 'bg-surface text-fg ring-1 ring-border'

  return (
    <span
      aria-current={isCurrent ? 'true' : undefined}
      aria-label={fullName}
      title={fullName}
      className={`inline-flex max-w-[14rem] items-center overflow-hidden rounded-full pr-3 text-sm ${tone} ${className ?? ''}`}
    >
      <Avatar participant={participant} size="sm" />
      <span className="truncate pl-2">{visibleName}</span>
    </span>
  )
}
