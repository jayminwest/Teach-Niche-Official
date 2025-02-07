/**
 * Jest configuration for Next.js projects
 * @module jest.config
 * @see https://nextjs.org/docs/testing#jest-and-react-testing-library
 */

const nextJest = require('next/jest')

/**
 * Creates a Jest configuration object with Next.js defaults
 * @function createJestConfig
 * @param {Object} options - Configuration options
 * @param {string} options.dir - Directory path for Next.js
 * @returns {Object} Jest configuration object
 */
const createJestConfig = nextJest({
  dir: './',
})

/**
 * Custom Jest configuration extending Next.js defaults
 * @type {Object}
 * @property {string} testEnvironment - The test environment to use
 * @property {string[]} setupFilesAfterEnv - Files to run after test environment setup
 * @property {Object} moduleNameMapper - Module path aliases
 * @property {string[]} testPathIgnorePatterns - Paths to ignore when looking for test files
 */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/'
  ],
  reporters: [
    ["jest-spec-reporter", {
      suppressPending: true,
      removeColors: false,
      fullPath: false
    }]
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx'
  ]
}

module.exports = createJestConfig(customJestConfig)
