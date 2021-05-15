const commonConfig = require("@darekkay/scripts/src/config/jest.config");

module.exports = {
  ...commonConfig,

  preset: "ts-jest",

  // TODO: improve test coverage
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 75,
      functions: 80,
      lines: 85,
    },
  },

  coveragePathIgnorePatterns: [
    ...commonConfig.coveragePathIgnorePatterns,

    // TODO: check
    "src/components/.*/selectors.ts",
    "src/common/utils/mock.tsx",
    "src/widgets/list.ts",
    "src/widgets/.*/properties.ts",
    "src/widgets/.*/configuration.tsx",
    "src/widgets/.*/sagas.ts",

    // TODO: write tests
    "src/state/injector/",
  ],
};
