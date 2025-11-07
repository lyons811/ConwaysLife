//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['*.config.js', '*.config.ts', '*.config.mjs'],
  },
  ...tanstackConfig,
]
