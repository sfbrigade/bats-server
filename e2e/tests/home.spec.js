const { test, expect } = require('@playwright/test');

const env = process.env.NODE_ENV || 'development';

const SMTP_HOST = env === 'development' ? 'localhost' : process.env.SMTP_HOST;

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
    await page.goto(`http://${SMTP_HOST}:1080/`);
    await expect(page.getByText('MailCatcher')).toBeVisible();
  });

  test.skip('Try fetching messages from MailCatcher', async({ request }) => {
      const allMessagesRequest = await request.get("http://${SMTP_HOST}:1080/messages");
      expect(allMessagesRequest.ok()).toBeTruthy();
      const allMessages = await allMessagesRequest.json();
      console.log(allMessages);
      const deleteRequest = await request.delete("http://${SMTP_HOST}:1080/messages");
      expect(deleteRequest.ok()).toBeTruthy();
  })
});
