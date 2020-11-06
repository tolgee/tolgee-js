module.exports = {
    automock: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/__testFixtures/setupAfterEnv.ts'],
    "unmockedModulePathPatterns": [
        "<rootDir>/node_modules/react",
        "<rootDir>/node_modules/react-dom",
        "<rootDir>/node_modules/lodash/*",
        "<rootDir>/node_modules/lodash/*",
        "<rootDir>/node_modules/core-js-pure/internals/*",
        "<rootDir>/src/__testFixtures/*",
        "/node_modules/*",
    ],
    modulePathIgnorePatterns: ["cypress"],
    moduleNameMapper: {
        "@testFixtures/(.*)": "<rootDir>/src/__testFixtures/$1"
    },
    globals: {
        'ts-jest': {
            tsConfig: "<rootDir>/tsconfig.spec.json"
        }
    }
};