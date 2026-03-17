import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ivedian/);
  await expect(page.getByRole("heading", { name: /instant reply/i })).toBeVisible();
  await expect(page.getByText("Set up once. Follow up forever.")).toBeVisible();
});

test("privacy page loads", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText("info@ivedian.com").first()).toBeVisible();
});

test("terms page loads", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  await expect(page.getByText("Austin, TX 78731").first()).toBeVisible();
});

test("contact page loads", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Get in touch" })).toBeVisible();
  await expect(page.getByText("info@ivedian.com").first()).toBeVisible();
});

test("sign-in page loads", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByLabel("Email address")).toBeVisible();
});
