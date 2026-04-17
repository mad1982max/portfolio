/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: false,
            tsconfig: './tsconfig.test.json',
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    },
    coverageThreshold: {
        global: {
            lines: 80,
            branches: 80,
            functions: 80,
        },
    },
    extensionsToTreatAsEsm: [],
};
