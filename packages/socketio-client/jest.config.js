module.exports = {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  unmockedModulePathPatterns: [
    '<rootDir>/src/__testFixtures/*',
    '/node_modules/*',
  ],
  modulePathIgnorePatterns: ['cypress'],
  moduleNameMapper: {
    '@testFixtures/(.*)': '<rootDir>/src/__testFixtures/$1',
  },
};
