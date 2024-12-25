import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: [                       
      'test/**/*.js',
      'test/**/*.d.ts',
      'test/**/*.js.map',
      'dist/**/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 20000,
    hookTimeout: 20000,
    teardownTimeout: 1000
  }
})