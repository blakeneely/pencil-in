import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@component-library/primitives': path.resolve(
        import.meta.dirname,
        'src/lib/primitives/index.ts',
      ),
      '@component-library/sign-up-sheet': path.resolve(
        import.meta.dirname,
        'src/lib/sign-up-sheet/index.ts',
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
})
