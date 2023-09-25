const { test, expect } = require('@playwright/test');

const SMTP_HOST = process.env.SMTP_HOST;

test.beforeEach(async ({ request }) => {
  await request.delete(`http://${SMTP_HOST}:1080/messages`);
});

test.describe('2FA', () => {
  test.describe.configure({ mode: 'serial' });

  test('shows the Routed logo and two factor authentication form', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('mission.bernal.er@c4sf.me');
    const password = page.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(page).toHaveURL('/twoFactor');
    await expect(page).toHaveTitle(/Routed/);
    await expect(page.getByAltText('Routed logo')).toBeVisible();
    await expect(page.getByText('Please enter the Authorization Code that was sent to your email address.')).toBeVisible();
    await expect(page.getByLabel('Code')).toBeVisible();
    await expect(page.getByText('Submit')).toBeVisible();
  });

  test('Shows Error after Incorrect Two Factor Authentication', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('mission.bernal.er@c4sf.me');
    const password = page.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(page).toHaveURL('/twoFactor');
    await page.getByLabel('Code').fill('123456');
    await page.getByText('Submit').click();
    await expect(page.getByText('Invalid Authorization Code.')).toBeVisible();
  });

  test('logs in as EMS user with 2FA', async ({ context, request }) => {
    const appPage = await context.newPage();

    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('amr.user@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');

    await new Promise((resolve) => setTimeout(resolve, 200));

    const allMsgsResponse = await request.get(`http://${SMTP_HOST}:1080/messages`);
    const messages = await allMsgsResponse.json();
    const lastMessageIdx = messages.length;
    await expect(lastMessageIdx).toBeGreaterThan(0);

    const msgResponse = await request.get(`http://${SMTP_HOST}:1080/messages/${lastMessageIdx}.plain`);
    const emailText = await msgResponse.text();

    // Use a regular expression to find "Code: " + six-digit number
    const regex = /code is: (\d{6}) /;
    const foundCode = emailText.match(regex);
    expect(foundCode).not.toBeNull();

    const authCode = foundCode[1];
    const code = appPage.getByLabel('Code');
    await code.fill(authCode);
    await code.press('Enter');

    const pageBody = appPage.locator('body');
    await expect(pageBody).not.toHaveText(/Invalid Authorization/);
    await expect(appPage).toHaveURL('/ems');

    // Gracefully close up everything
    await context.close();
  });

  test('logs in as Hospital user with 2FA', async ({ context, request }) => {
    const appPage = await context.newPage();

    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('mission.bernal.er@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');

    await new Promise((resolve) => setTimeout(resolve, 200));

    const allMsgsResponse = await request.get(`http://${SMTP_HOST}:1080/messages`);
    const messages = await allMsgsResponse.json();
    const lastMessageIdx = messages.length;
    await expect(lastMessageIdx).toBeGreaterThan(0);

    const msgResponse = await request.get(`http://${SMTP_HOST}:1080/messages/${lastMessageIdx}.plain`);
    const emailText = await msgResponse.text();
    // Use a regular expression to find "Code: " + six-digit number
    const regex = /code is: (\d{6}) /;
    const foundCode = emailText.match(regex);
    expect(foundCode).not.toBeNull();

    const authCode = foundCode[1];
    const code = appPage.getByLabel('Code');
    await code.fill(authCode);
    await code.press('Enter');

    const pageBody = appPage.locator('body');
    await expect(pageBody).not.toHaveText(/Invalid Authorization/);
    await expect(appPage).toHaveURL('/er');

    // Gracefully close up everything
    await context.close();
  });
});
