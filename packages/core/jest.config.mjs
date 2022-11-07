export default {
  preset: 'ts-jest',
  roots: ['src'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/__test/jest-setup.ts'],
};
