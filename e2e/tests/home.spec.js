const { test, expect } = require('@playwright/test');

test.describe('home', () => {
  test('shows the Routed logo and sign in form', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Routed/);
    await expect(page.getByAltText('Routed logo')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByText('Login')).toBeVisible();
  });

  test('shows error message after invalid credentials submitted', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('invalid@email.com');
    const password = page.getByLabel('Password');
    await password.fill('wrong');
    await password.press('Enter');
    await expect(page.getByText('Invalid email and/or password.')).toBeVisible();
  });

  test('redirects to EMS interface after EMS user login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill(process.env.EMS_USER);
    const password = page.getByLabel('Password');
    await password.fill(process.env.EMS_PASS);
    await password.press('Enter');
    await expect(page).toHaveURL('/ems');
  });

  test('redirects to ER interface after Hospital user login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill(process.env.HOSPITAL_USER);
    const password = page.getByLabel('Password');
    await password.fill(process.env.HOSPITAL_PASS);
    await password.press('Enter');
    await expect(page).toHaveURL('/er');
  });
});
