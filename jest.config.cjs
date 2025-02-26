module.exports = {
  preset: "ts-jest/presets/default-esm",  // Suporte a ES Modules no TypeScript
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  clearMocks: true,
  setupFiles: ["dotenv/config"],
  extensionsToTreatAsEsm: [".ts", ".mts"], // Garante que .mts seja tratado como ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.mts$": "$1", // Permite importar sem precisar do .mts
  },
};
