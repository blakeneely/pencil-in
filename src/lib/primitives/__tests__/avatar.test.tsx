import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Avatar } from '../avatar'
import type { Participant } from '../types'

const CHER: Participant = { id: '1', name: 'Cher' }
const MARY_BETH_SMITH: Participant = { id: '1', name: 'Mary Beth Smith' }
const JANE_DOE: Participant = { id: '1', name: 'jane doe' }
const BLANK_NAME: Participant = { id: '1', name: '   ' }
const CHER_WITH_AVATAR: Participant = {
  id: '1',
  name: 'Cher',
  avatarUrl: '/u/1.png'
}
const PARTICIPANT_ABC_X: Participant = { id: 'abc-123', name: 'X' }
const PARTICIPANT_ABC_Y: Participant = { id: 'abc-123', name: 'Y' }
const SPREAD_PARTICIPANTS: readonly Participant[] = [
  { id: 'a', name: 'A' },
  { id: 'b', name: 'B' },
  { id: 'c', name: 'C' },
  { id: 'd', name: 'D' },
  { id: 'e', name: 'E' },
  { id: 'f', name: 'F' },
  { id: 'g', name: 'G' },
  { id: 'h', name: 'H' },
  { id: 'i', name: 'I' },
  { id: 'j', name: 'J' }
]

describe('Avatar', () => {
  it('derives initials from a single-word name', () => {
    render(<Avatar participant={CHER} />)
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('derives initials from the first two words of a multi-word name', () => {
    render(<Avatar participant={MARY_BETH_SMITH} />)
    expect(screen.getByText('MB')).toBeInTheDocument()
  })

  it('derives uppercase initials regardless of input casing', () => {
    render(<Avatar participant={JANE_DOE} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('falls back to "?" when the name is empty whitespace', () => {
    render(<Avatar participant={BLANK_NAME} />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders the image when avatarUrl is provided', () => {
    render(<Avatar participant={CHER_WITH_AVATAR} />)
    const img = document.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('/u/1.png')
  })

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar participant={CHER_WITH_AVATAR} />)
    const img = document.querySelector('img')
    expect(img).not.toBeNull()
    fireEvent.error(img!)
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('picks the same color for the same id', () => {
    const { container, rerender } = render(
      <Avatar participant={PARTICIPANT_ABC_X} />
    )
    const first = container
      .querySelector('[data-avatar-color-index]')
      ?.getAttribute('data-avatar-color-index')
    rerender(<Avatar participant={PARTICIPANT_ABC_Y} />)
    const second = container
      .querySelector('[data-avatar-color-index]')
      ?.getAttribute('data-avatar-color-index')
    expect(first).toBe(second)
  })

  it('picks different colors across a spread of ids', () => {
    const colors = new Set<string>()
    for (const participant of SPREAD_PARTICIPANTS) {
      const { container, unmount } = render(
        <Avatar participant={participant} />
      )
      const idx = container
        .querySelector('[data-avatar-color-index]')
        ?.getAttribute('data-avatar-color-index')
      if (idx) colors.add(idx)
      unmount()
    }
    expect(colors.size).toBeGreaterThan(1)
  })
})
