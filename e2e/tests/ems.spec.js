const { test, expect } = require('@playwright/test');
test.describe('Without 2FA', () => {
  test('redirects to EMS interface after EMS user login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill(process.env.EMS_USER);
    const password = page.getByLabel('Password');
    await password.fill(process.env.EMS_PASS);
    await password.press('Enter');
    await expect(page).toHaveURL('/ems');
  });
});
