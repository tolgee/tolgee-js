module.exports = {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  unmockedModulePathPatterns: ['/node_modules/*'],
  modulePathIgnorePatterns: ['cypress'],
  transformIgnorePatterns: ['node_modules/(?!@tolgee/core)'],
  roots: ['src'],
};
