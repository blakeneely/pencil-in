import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/**
 * When the viewport sits above `breakpointPx`, force the referenced
 * `<details>` element open. Below the breakpoint the hook releases control
 * so the user's collapse/expand persists. Reads the current media-query
 * state on mount and listens for `change` events without per-frame polling.
 *
 * Returns a ref that callers attach to the `<details>` element.
 */
export function useExpandedAboveBreakpoint(
  breakpointPx: number
): RefObject<HTMLDetailsElement | null> {
  const ref = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const mql = window.matchMedia(`(min-width: ${String(breakpointPx)}px)`)

    const apply = () => {
      if (mql.matches && ref.current && !ref.current.open) {
        ref.current.open = true
      }
    }

    apply()
    mql.addEventListener('change', apply)
    return () => {
      mql.removeEventListener('change', apply)
    }
  }, [breakpointPx])

  return ref
}
