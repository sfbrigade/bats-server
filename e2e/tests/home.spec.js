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

  test('Try Opening Mail Catcher', async ({ page }) => {
    await page.goto(`http://${process.env.SMTP_HOST}:1080/`);
    await expect(page.getByText('MailCatcher')).toBeVisible();
  });
});
