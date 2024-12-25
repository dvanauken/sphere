import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 20000,
    hookTimeout: 20000,
    teardownTimeout: 1000,
    alias: {
      '@': '/src',  // This allows imports from '@/...'
      '~': '/test'  // This allows imports from '~/...'
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '~': '/test'
    }
  }
})