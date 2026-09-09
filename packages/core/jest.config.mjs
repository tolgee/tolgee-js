export default {
  preset: 'ts-jest',
  roots: ['src'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/__test/jest-setup.ts'],
  globals: { __TOLGEE_VERSION__: '0.0.0-test' },
};
