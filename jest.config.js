(module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
}),
  (process.env = {
    ...process.env,
    ...require("dotenv").config({ path: ".env.test" }).parsed,
  });
