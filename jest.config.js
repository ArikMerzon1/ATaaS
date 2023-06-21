module.exports = {
  preset: "ts-jest",
  testEnvironment: "./seleniumEnvironment.ts",
  testTimeout: 12 * 60 * 1000,
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "./test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        useCssFile: false,
        sort: "titleAsc",
      },
    ],
  ],
};
