import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SheetHeader } from '../sheet-header'
import { SignUpSheetProvider } from '../state/sign-up-sheet-provider'
import type { Messages } from '../types'

const JP_MESSAGES: Partial<Messages> = Object.freeze({
  timeZoneNote: '{timeZone}時間'
})

describe('SheetHeader', () => {
  it('renders title and description', () => {
    render(
      <SignUpSheetProvider>
        <SheetHeader title="Volunteer Day" description="All hands welcome" />
      </SignUpSheetProvider>
    )
    expect(
      screen.getByRole('heading', { name: 'Volunteer Day' })
    ).toBeInTheDocument()
    expect(screen.getByText('All hands welcome')).toBeInTheDocument()
  })

  it('omits the description paragraph when not provided', () => {
    const { container } = render(
      <SignUpSheetProvider>
        <SheetHeader title="Just a title" />
      </SignUpSheetProvider>
    )
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('renders the timezone note when timeZone is set on the provider', () => {
    render(
      <SignUpSheetProvider timeZone="EDT">
        <SheetHeader title="With timezone" />
      </SignUpSheetProvider>
    )
    expect(screen.getByText('All times in EDT')).toBeInTheDocument()
  })

  it('omits the timezone note when timeZone is not set', () => {
    const { container } = render(
      <SignUpSheetProvider>
        <SheetHeader title="No timezone" />
      </SignUpSheetProvider>
    )
    expect(container.querySelector('[data-sheet-header-timezone]')).toBeNull()
  })

  it('respects an overridden messages.timeZoneNote template', () => {
    render(
      <SignUpSheetProvider timeZone="JST" messages={JP_MESSAGES}>
        <SheetHeader title="Override" />
      </SignUpSheetProvider>
    )
    expect(screen.getByText('JST時間')).toBeInTheDocument()
  })
})
