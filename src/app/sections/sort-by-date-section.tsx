import type { Theme } from '@component-library/sign-up-sheet'
import {
  SignUpSheet,
  useSignUpSheetState
} from '@component-library/sign-up-sheet'
import { useState } from 'react'

import { currentUser, sortByDateSheet } from '../demo-data'
import { Section } from '../section'

export function SortByDateSection() {
  const [theme, setTheme] = useState<Theme>('light')
  const state = useSignUpSheetState(sortByDateSheet, { currentUser })
  return (
    <Section
      title="Sort-by-date layout"
      caption="Wired-up table layout with realistic data, live join/leave, and the live a11y region."
      theme={theme}
      onThemeChange={setTheme}
    >
      <SignUpSheet
        data={state.data}
        currentUser={state.currentUser}
        pendingSlotIds={state.pendingSlotIds}
        slotErrors={state.slotErrors}
        timeZone="EDT"
        onSlotJoin={state.joinSlot}
        onSlotLeave={state.leaveSlot}
      />
    </Section>
  )
}
