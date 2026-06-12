import { test, expect } from "@playwright/test";

test("gửi form đối tác thành công và hiện thông báo", async ({ page }) => {
  await page.goto("/vi/cho-thue-xe");
  await expect(page.getByTestId("partner-form")).toBeVisible();

  await page.locator('input[name="name"]').fill("Anh Test");
  await page.locator('input[name="phone"]').fill("0987654321");
  await page.locator('input[name="carInfo"]').fill("Toyota Fortuner 7 chỗ");

  await page.getByRole("button", { name: /Gửi thông tin/ }).click();

  await expect(page.getByTestId("partner-success")).toBeVisible();
});
