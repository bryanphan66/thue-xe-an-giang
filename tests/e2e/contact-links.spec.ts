import { test, expect } from "@playwright/test";

const PHONE = "0326120108";

test("nút Gọi mở sheet với link tel: đúng số", async ({ page }) => {
  await page.goto("/vi");
  await page.getByRole("button", { name: /Gọi ngay/ }).first().click();
  const telLink = page.locator(`a[href="tel:${PHONE}"]`);
  await expect(telLink).toBeVisible();
});

test("nút Zalo mở sheet với link zalo.me đúng số", async ({ page }) => {
  await page.goto("/vi");
  await page.getByRole("button", { name: /Nhắn Zalo/ }).first().click();
  const zaloLink = page.locator(`a[href="https://zalo.me/${PHONE}"]`);
  await expect(zaloLink).toBeVisible();
});
