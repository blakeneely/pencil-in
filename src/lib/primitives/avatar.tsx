import { useCallback, useState } from 'react'

import type { Participant } from './types'

const AVATAR_BG_CLASSES = [
  'bg-avatar-1',
  'bg-avatar-2',
  'bg-avatar-3',
  'bg-avatar-4',
  'bg-avatar-5',
  'bg-avatar-6'
] as const

function hashId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const first = parts[0] ?? ''
    return first.charAt(0).toUpperCase() || '?'
  }
  const first = parts[0] ?? ''
  const second = parts[1] ?? ''
  return (first.charAt(0) + second.charAt(0)).toUpperCase()
}

export type AvatarProps = {
  /**
   * The person to render. The image at `avatarUrl` is preferred; if it
   * fails to load (or is absent) initials derived from `name` are shown
   * on a background color hashed from `id`.
   */
  participant: Participant
  /**
   * Visual size variant. `'sm'` (24px) suits inline chips; `'md'` (32px,
   * the default) suits standalone avatars.
   */
  size?: 'sm' | 'md'
}

export function Avatar({ participant, size = 'md' }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const handleError = useCallback(() => {
    setImageFailed(true)
  }, [])

  const initials = deriveInitials(participant.name)
  const colorIndex = hashId(participant.id) % AVATAR_BG_CLASSES.length
  const colorClass = AVATAR_BG_CLASSES[colorIndex]
  const sizeClass = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'

  if (participant.avatarUrl && !imageFailed) {
    return (
      <img
        src={participant.avatarUrl}
        alt=""
        onError={handleError}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
        data-avatar-color-index={colorIndex}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} ${colorClass} inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      data-avatar-color-index={colorIndex}
      data-avatar-initials={initials}
    >
      {initials}
    </span>
  )
}
