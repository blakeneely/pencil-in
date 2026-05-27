import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CapacityPill } from '../capacity-pill'

describe('CapacityPill', () => {
  it('renders "Full" when filled equals capacity', () => {
    render(<CapacityPill capacity={3} filled={3} />)
    expect(screen.getByText('Full')).toBeInTheDocument()
  })

  it('renders filled-of-total + remaining when room is left', () => {
    render(<CapacityPill capacity={6} filled={3} />)
    expect(
      screen.getByText('3 of 6 spots filled · 3 spots remaining')
    ).toBeInTheDocument()
  })

  it('uses singular form when exactly one slot remains', () => {
    render(<CapacityPill capacity={3} filled={2} />)
    expect(
      screen.getByText('2 of 3 spots filled · 1 spot remaining')
    ).toBeInTheDocument()
  })

  it('renders entire capacity as remaining when none are filled', () => {
    render(<CapacityPill capacity={4} filled={0} />)
    expect(
      screen.getByText('0 of 4 spots filled · 4 spots remaining')
    ).toBeInTheDocument()
  })

  it('clamps to "Full" when participants exceed capacity', () => {
    render(<CapacityPill capacity={2} filled={5} />)
    expect(screen.getByText('Full')).toBeInTheDocument()
  })
})
