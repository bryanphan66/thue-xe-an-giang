import { test, expect } from "@playwright/test";

test("trang chủ hiển thị danh sách xe (fixtures: 4 xe)", async ({ page }) => {
  await page.goto("/vi");
  const cards = page.getByTestId("car-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toContainText("Toyota Vios");
});

test("trang chủ có thanh liên hệ sticky GỌI/ZALO", async ({ page }) => {
  await page.goto("/vi");
  await expect(page.getByRole("button", { name: /Gọi ngay/ }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Nhắn Zalo/ }).first()).toBeVisible();
});
