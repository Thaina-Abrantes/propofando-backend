module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/src/migrations/",
        "/tests/",
    ],
    coverageReporters: ["lcov", "text"],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    modulePaths: ["<rootDir>/src/"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js?(x)"],
};
