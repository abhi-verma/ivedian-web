import { test, expect } from "@playwright/test";

// Mock data
const mockMetrics = {
  total_clients: 2,
  total_leads: 5,
  total_messages: 12,
  clients_by_status: { trial: 1, active: 1, paused: 0, churned: 0 },
};

const mockClients = [
  {
    id: 1,
    business_name: "Glow Med Spa",
    owner_name: "Jane Smith",
    owner_email: "jane@glowmedspa.com",
    subscription_status: "active",
    trial_end_date: "2026-04-15T00:00:00+00:00",
    lead_count: 3,
    created_at: "2026-03-01T00:00:00+00:00",
  },
  {
    id: 2,
    business_name: "Luxe Aesthetics",
    owner_name: "Sarah Lee",
    owner_email: "sarah@luxe.com",
    subscription_status: "trial",
    trial_end_date: "2026-04-20T00:00:00+00:00",
    lead_count: 2,
    created_at: "2026-03-10T00:00:00+00:00",
  },
];

const mockClient = {
  id: 1,
  business_name: "Glow Med Spa",
  owner_name: "Jane Smith",
  owner_email: "jane@glowmedspa.com",
  billing_email: "billing@glowmedspa.com",
  booking_link: "https://calendly.com/glowmedspa",
  twilio_phone_number: "+18883945105",
  dashboard_token: "abc123token",
  subscription_status: "active",
  trial_start_date: "2026-03-01T00:00:00+00:00",
  trial_end_date: "2026-04-15T00:00:00+00:00",
  trial_leads_count: 3,
  trial_warning_sent: false,
  trial_expired_handled: false,
  lead_count: 3,
  created_at: "2026-03-01T00:00:00+00:00",
};

const mockLeads = [
  {
    id: 10,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+15551234567",
    service_interest: "Botox",
    source: "website_form",
    status: "nurturing",
    message_count: 3,
    created_at: "2026-03-15T00:00:00+00:00",
  },
];

const mockMessages = [
  {
    id: 100,
    channel: "email",
    nurture_step: 0,
    content: "Hi Alice, thanks for your interest in Botox!",
    status: "sent",
    sent_at: "2026-03-15T10:00:00+00:00",
  },
  {
    id: 101,
    channel: "sms",
    nurture_step: 0,
    content: "Hi Alice! We'd love to help with Botox.",
    status: "sent",
    sent_at: "2026-03-15T10:00:05+00:00",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/admin/metrics", async (route) => {
    await route.fulfill({ json: mockMetrics });
  });

  await page.route("**/api/admin/clients", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: mockClients });
    } else {
      await route.continue();
    }
  });

  await page.route("**/api/admin/clients/1", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: mockClient });
    } else if (route.request().method() === "PATCH") {
      await route.fulfill({ json: { status: "updated", client_id: 1 } });
    } else if (route.request().method() === "DELETE") {
      await route.fulfill({ json: { status: "deleted", client_id: 1 } });
    } else {
      await route.continue();
    }
  });

  await page.route("**/api/admin/clients/1/leads", async (route) => {
    await route.fulfill({ json: mockLeads });
  });

  await page.route("**/api/admin/clients/1/pause", async (route) => {
    await route.fulfill({ json: { status: "paused", client_id: 1 } });
  });

  await page.route("**/api/admin/clients/1/resume", async (route) => {
    await route.fulfill({ json: { status: "resumed", client_id: 1 } });
  });

  await page.route("**/api/admin/clients/1/extend-trial", async (route) => {
    await route.fulfill({ json: { status: "extended", client_id: 1 } });
  });

  await page.route("**/api/admin/leads/10/messages", async (route) => {
    await route.fulfill({ json: mockMessages });
  });
});

test("admin client list shows metrics and clients", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText("Total clients")).toBeVisible();
  await expect(page.getByText("Glow Med Spa")).toBeVisible();
  await expect(page.getByText("Luxe Aesthetics")).toBeVisible();
});

test("client detail page loads correctly", async ({ page }) => {
  await page.goto("/admin/clients/1");
  await expect(page.getByRole("heading", { name: "Glow Med Spa" })).toBeVisible();
  await expect(page.getByText("Jane Smith")).toBeVisible();
  await expect(page.getByText("Alice Johnson")).toBeVisible();
});

test("edit client form pre-fills and saves", async ({ page }) => {
  await page.goto("/admin/clients/1/edit");
  await expect(page.locator("input#owner_name")).toHaveValue("Jane Smith");
  await expect(page.locator("input#booking_link")).toHaveValue("https://calendly.com/glowmedspa");

  await page.getByLabel(/booking link/i).fill("https://calendly.com/updated");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL("**/admin/clients/1", { timeout: 10000 });
  await expect(page).toHaveURL(/\/admin\/clients\/1$/);
});

test("pause button calls pause endpoint", async ({ page }) => {
  let pauseCalled = false;
  await page.route("**/api/admin/clients/1/pause", async (route) => {
    pauseCalled = true;
    await route.fulfill({ json: { status: "paused", client_id: 1 } });
  });

  await page.goto("/admin/clients/1");
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(async () => {
    expect(pauseCalled).toBe(true);
  }).toPass({ timeout: 5000 });
});

test("message history page loads", async ({ page }) => {
  await page.goto("/admin/leads/10");
  await expect(page.getByText("Hi Alice, thanks for your interest in Botox!")).toBeVisible();
  await expect(page.getByText("email").first()).toBeVisible();
  await expect(page.getByText("sms").first()).toBeVisible();
});

test("add client form renders all fields", async ({ page }) => {
  await page.goto("/admin/clients/new");
  await expect(page.getByLabel(/business name/i)).toBeVisible();
  await expect(page.getByLabel(/owner name/i)).toBeVisible();
  await expect(page.getByLabel(/owner email/i)).toBeVisible();
  await expect(page.getByLabel(/booking link/i)).toBeVisible();
  await expect(page.getByLabel(/twilio phone/i)).toBeVisible();
});
