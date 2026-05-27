import type { ReactNode } from 'react'

import { useExpandedAboveBreakpoint } from './use-expanded-above-breakpoint'

export type CollapsibleSectionProps = {
  /**
   * Content rendered inside the `<summary>` (clickable affordance).
   * Typically a heading element.
   */
  summary: ReactNode
  /**
   * Whether the section starts open. Independent of the responsive
   * force-open behavior, which can override this above the breakpoint.
   */
  defaultOpen?: boolean
  /** Body content revealed when the section is open. */
  children: ReactNode
  /** Optional extra classes applied to the `<details>` wrapper. */
  className?: string
  /** Optional extra classes applied to the `<summary>` row. */
  summaryClassName?: string
  /** Optional DOM `id` on the `<details>` element. */
  id?: string
  /**
   * Viewport breakpoint (px) above which the section is forcibly opened
   * regardless of user collapse state. Defaults to 768 to match the
   * Tailwind `md` breakpoint used by the recipe layouts.
   */
  forceOpenAboveBreakpoint?: number
}

export function CollapsibleSection({
  summary,
  defaultOpen = false,
  children,
  className,
  summaryClassName,
  id,
  forceOpenAboveBreakpoint = 768
}: CollapsibleSectionProps) {
  const ref = useExpandedAboveBreakpoint(forceOpenAboveBreakpoint)

  return (
    <details
      ref={ref}
      id={id}
      data-collapsible-section
      open={defaultOpen}
      className={`group ${className ?? ''}`}
    >
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-2 ${summaryClassName ?? ''}`}
      >
        {summary}
        <span
          aria-hidden="true"
          data-collapsible-affordance
          className="text-fg-muted transition-transform group-open:rotate-90"
        >
          ▶
        </span>
      </summary>
      <div data-collapsible-content>{children}</div>
    </details>
  )
}
