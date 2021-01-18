module.exports = {
    automock: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    "unmockedModulePathPatterns": [
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