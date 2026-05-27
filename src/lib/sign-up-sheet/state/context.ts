import { createContext, use } from 'react'

import type { CurrentUser } from '../../primitives/types'
import type { DefaultExpandedMode, Messages } from '../types'

/**
 * Shape of the context value distributed by `<SignUpSheetProvider>`. All
 * recipe components read this via {@link useSignUpSheetContext}.
 */
export type SignUpSheetContextValue = {
  /** The signed-in viewer, or `undefined` for read-only mode. */
  currentUser?: CurrentUser
  /** Slot IDs with an in-flight join/leave mutation. */
  pendingSlotIds: ReadonlySet<string>
  /** Per-slot error messages, keyed by slot ID. */
  slotErrors: Readonly<Record<string, string>>
  /** Merged messages (consumer overrides on top of English defaults). */
  messages: Messages
  /** Consumer-supplied timezone label for the header note. */
  timeZone?: string
  /** Maximum participant chips shown before the "+N more" expander. */
  maxVisibleParticipants: number
  /** Initial section expansion mode for date-grouped layouts. */
  defaultExpandedMode: DefaultExpandedMode
  /** Section-count threshold used by `defaultExpandedMode: 'auto'`. */
  collapseThreshold: number
  /** Fires when the user requests to join a slot. */
  onSlotJoin?: (slotId: string) => void
  /** Fires when the user requests to leave a slot. */
  onSlotLeave?: (slotId: string) => void
  /**
   * Pushes a polite live-region announcement. The dispatcher uses this
   * to narrate the current user's own join/leave events.
   */
  announce: (message: string) => void
}

export const SignUpSheetContext = createContext<
  SignUpSheetContextValue | undefined
>(undefined)

export function useSignUpSheetContext(): SignUpSheetContextValue {
  const value = use(SignUpSheetContext)
  if (!value) {
    throw new Error(
      'useSignUpSheetContext must be used inside a <SignUpSheetProvider>'
    )
  }
  return value
}
