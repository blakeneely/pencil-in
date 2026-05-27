import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useExpandedAboveBreakpoint } from '../use-expanded-above-breakpoint'

type Listener = (event: { matches: boolean }) => void

type MockMediaQueryList = {
  matches: boolean
  media: string
  addEventListener: (type: 'change', listener: Listener) => void
  removeEventListener: (type: 'change', listener: Listener) => void
  emit: (matches: boolean) => void
}

function installMatchMediaMock(initialMatches: boolean): MockMediaQueryList {
  const listeners = new Set<Listener>()
  const mql: MockMediaQueryList = {
    matches: initialMatches,
    media: '',
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => {
      listeners.delete(listener)
    },
    emit: (matches: boolean) => {
      mql.matches = matches
      listeners.forEach(listener => {
        listener({ matches })
      })
    }
  }
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn(() => mql)
  })
  return mql
}

function Harness({ breakpointPx }: { breakpointPx: number }) {
  const ref = useExpandedAboveBreakpoint(breakpointPx)
  return (
    <details ref={ref}>
      <summary>Heading</summary>
      <p>Body</p>
    </details>
  )
}

afterEach(() => {
  delete (window as unknown as { matchMedia?: unknown }).matchMedia
})

describe('useExpandedAboveBreakpoint', () => {
  it('forces the details open when the viewport starts above the breakpoint', () => {
    installMatchMediaMock(true)
    const { container } = render(<Harness breakpointPx={768} />)
    const details = container.querySelector('details')
    expect(details?.open).toBe(true)
  })

  it('leaves the details closed when the viewport starts below the breakpoint', () => {
    installMatchMediaMock(false)
    const { container } = render(<Harness breakpointPx={768} />)
    const details = container.querySelector('details')
    expect(details?.open).toBe(false)
  })

  it('forces the details open when the viewport crosses up over the breakpoint', () => {
    const mql = installMatchMediaMock(false)
    const { container } = render(<Harness breakpointPx={768} />)
    const details = container.querySelector('details')
    expect(details?.open).toBe(false)
    mql.emit(true)
    expect(details?.open).toBe(true)
  })

  it('does not force the details closed when the viewport crosses below the breakpoint', () => {
    const mql = installMatchMediaMock(true)
    const { container } = render(<Harness breakpointPx={768} />)
    const details = container.querySelector('details')
    expect(details?.open).toBe(true)
    mql.emit(false)
    expect(details?.open).toBe(true)
  })

  it('is a no-op when matchMedia is unavailable', () => {
    const { container } = render(<Harness breakpointPx={768} />)
    const details = container.querySelector('details')
    expect(details?.open).toBe(false)
  })
})
