module.exports = {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  unmockedModulePathPatterns: ['/node_modules/*'],
  modulePathIgnorePatterns: ['cypress'],
  transformIgnorePatterns: ['node_modules/(?!@tolgee/core)'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'vue'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
  },
};
