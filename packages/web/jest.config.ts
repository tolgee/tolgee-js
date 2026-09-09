export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@tolgee)', '^.+\\.js$'],
  moduleNameMapper: {
    '@testFixtures/(.*)': '<rootDir>/src/__testFixtures/$1',
  },
  roots: ['src'],
  globals: { __TOLGEE_VERSION__: '0.0.0-test' },
};
