import { test, expect } from "@playwright/test";

test('vào được trang chi tiết xe từ nút "Xem chi tiết"', async ({ page }) => {
  await page.goto("/vi");
  await page.getByTestId("car-detail-link").first().click();
  await expect(page).toHaveURL(/\/vi\/xe\/vios$/);
  await expect(page.getByRole("heading", { name: "Toyota Vios", level: 1 })).toBeVisible();
});

test("trang chi tiết hiển thị bảng giá", async ({ page }) => {
  await page.goto("/vi/xe/vios");
  await expect(page.getByText("1.200.000")).toBeVisible();
  await expect(page.getByText("700.000")).toBeVisible();
});
