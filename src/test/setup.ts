import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect } from 'vitest'

expect.extend(toHaveNoViolations)

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Assertion {
    toHaveNoViolations: () => void
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AsymmetricMatchersContaining {
    toHaveNoViolations: () => unknown
  }
}

afterEach(() => {
  cleanup()
})
