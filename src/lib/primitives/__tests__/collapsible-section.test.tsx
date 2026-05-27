import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollapsibleSection } from '../collapsible-section'

describe('CollapsibleSection', () => {
  it('is closed by default', () => {
    render(
      <CollapsibleSection summary="Group A">
        <p>Hidden contents</p>
      </CollapsibleSection>
    )
    const details = screen.getByText('Group A').closest('details')
    expect(details?.hasAttribute('open')).toBe(false)
  })

  it('starts open when defaultOpen is true', () => {
    render(
      <CollapsibleSection summary="Group A" defaultOpen>
        <p>Visible contents</p>
      </CollapsibleSection>
    )
    const details = screen.getByText('Group A').closest('details')
    expect(details?.hasAttribute('open')).toBe(true)
  })

  it('toggles open state when the summary is clicked', () => {
    render(
      <CollapsibleSection summary="Group A">
        <p>Body</p>
      </CollapsibleSection>
    )
    const summary = screen.getByText('Group A')
    const details = summary.closest('details')
    expect(details?.hasAttribute('open')).toBe(false)
    fireEvent.click(summary)
    expect(details?.hasAttribute('open')).toBe(true)
  })

  it('renders the children inside the content wrapper', () => {
    render(
      <CollapsibleSection summary="Group A" defaultOpen>
        <p>Important body text</p>
      </CollapsibleSection>
    )
    expect(screen.getByText('Important body text')).toBeInTheDocument()
  })
})
