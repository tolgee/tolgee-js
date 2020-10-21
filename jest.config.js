module.exports = {
  automock: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "unmockedModulePathPatterns": [
    "<rootDir>/node_modules/react",
    "<rootDir>/node_modules/react-dom",
    "<rootDir>/node_modules/lodash/*",
    "<rootDir>/node_modules/lodash/*",
    "<rootDir>/node_modules/core-js-pure/internals/*",
    "<rootDir>/src/__testFixtures/*",
    "/node_modules/*",

  ],
  globals: {
    'ts-jest': {
      tsConfig: {
        "experimentalDecorators": true,
      }
    }
  }
};