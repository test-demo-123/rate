module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
    collectCoverageFrom: ['**/*.ts'],
    coveragePathIgnorePatterns: [
        '/src/.*\\.(fixture\\.ts|espec\\.ts|ispec\\.ts|spec\\.ts|d\\.ts|yml|md|json|xml)$'
    ],
    coverageDirectory: 'test-results',
    coverageReporters: ['html', 'json', 'lcov', 'text', 'cobertura'],
    moduleFileExtensions: ['ts', 'js'],
    // projects: ['src/'],
    testMatch: [`**/*.spec.ts`, `*.ts`],
};
