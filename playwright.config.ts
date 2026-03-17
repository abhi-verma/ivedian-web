import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
config({ path: ".env.local" });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    // Auth setup runs first — signs in and saves session
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Marketing pages — no auth needed
    {
      name: "marketing",
      testMatch: /marketing\.spec\.ts/,
    },
    // Admin pages — auth bypassed via PLAYWRIGHT_TEST=true in .env.local
    {
      name: "admin",
      testMatch: /admin\.spec\.ts/,
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
