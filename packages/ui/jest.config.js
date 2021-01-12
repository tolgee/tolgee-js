module.exports = {
    automock: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    "unmockedModulePathPatterns": [
        "/node_modules/*",
    ],
    moduleNameMapper: {
        "@testFixtures/(.*)": "<rootDir>/src/__testFixtures/$1"
    },
    globals: {
        'ts-jest': {
            tsConfig: "<rootDir>/tsconfig.spec.json"
        }
    }
};