import { test as setup } from "@playwright/test";

setup("clerk setup", async () => {
  // Auth is bypassed in tests via NEXT_PUBLIC_PLAYWRIGHT_TEST=true
});
