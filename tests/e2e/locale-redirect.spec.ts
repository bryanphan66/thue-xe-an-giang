import { test, expect } from "@playwright/test";

test("truy cập / chuyển hướng về locale vi", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/vi$/);
});
