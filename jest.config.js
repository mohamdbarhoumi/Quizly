// In jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Make sure this points to your Next.js app directory
});

const customJestConfig = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom', // Add this if you don't have it already
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // ... other custom Jest configurations you might have
};

module.exports = createJestConfig(customJestConfig);