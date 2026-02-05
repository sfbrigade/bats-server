const { test, expect } = require('@playwright/test');
test.describe('Without 2FA,', () => {
  test('redirects to ER interface after Hospital user login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill(process.env.HOSPITAL_USER);
    const password = page.getByLabel('Password');
    await password.fill(process.env.HOSPITAL_PASS);
    await password.press('Enter');
    await expect(page).toHaveURL('/er');
  });
});
