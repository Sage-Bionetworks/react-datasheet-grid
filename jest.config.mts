import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/setup.ts'],
  testPathIgnorePatterns: ['./dist'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    // 1. Mock CSS imports (standard)
    '\\.css$': '<rootDir>/tests/helpers/styleMock.ts',
    
    // 2. Map the scoped package name to the local source 
    // This allows your tests to run against the source code 
    // rather than the built /dist folder.
    '^@sage-bionetworks/react-datasheet-grid$': '<rootDir>/src/index.tsx',
  },
  // 3. Ensure ts-jest handles the specific TS config if needed
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
export default config
