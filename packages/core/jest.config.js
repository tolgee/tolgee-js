module.exports = {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__testFixtures/setupAfterEnv.ts'],
  roots: ['src'],
  unmockedModulePathPatterns: [
    '<rootDir>/src/__testFixtures/*',
    '/node_modules/*',
  ],
  moduleNameMapper: {
    '@testFixtures/(.*)': '<rootDir>/src/__testFixtures/$1',
  },
};
