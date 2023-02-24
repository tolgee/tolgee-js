export default {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['src'],
  setupFiles: ['../testing/setupJest.ts'],
  unmockedModulePathPatterns: [
    '<rootDir>/src/__testFixtures/*',
    '/node_modules/*',
  ],
  moduleNameMapper: {
    '@testFixtures/(.*)': '<rootDir>/src/__testFixtures/$1',
  },
};
