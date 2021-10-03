module.exports = {
  automock: true,
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  unmockedModulePathPatterns: ['/node_modules/*'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@tolgee)'],
  moduleNameMapper: {
    '@testFixtures/(.*)': '<rootDir>/src/__testFixtures/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
