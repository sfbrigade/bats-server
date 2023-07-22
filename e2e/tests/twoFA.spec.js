const { test, expect, chromium  } = require('@playwright/test');

test.describe('2FA', () => {
    test.describe.configure({ mode: 'serial' });
    test('shows the Routed logo and two factor authentication form', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill(process.env.HOSPITAL_USER);
        const password = page.getByLabel('Password');
        await password.fill(process.env.HOSPITAL_PASS);
        await password.press('Enter');
        await expect(page).toHaveURL('/auth/local/twoFactor');
        await expect(page).toHaveTitle(/Routed/);
        await expect(page.getByAltText('Routed logo')).toBeVisible();
        await expect(page.getByText('Please enter the Authorization Code that was sent to your E-mail')).toBeVisible();
        await expect(page.getByLabel('Code')).toBeVisible();
        await expect(page.getByText('Submit')).toBeVisible();
      });

    test('Shows Error after Incorrect Two Factor Authentication', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Email').fill(process.env.HOSPITAL_USER);
        const password = page.getByLabel('Password');
        await password.fill(process.env.HOSPITAL_PASS);
        await password.press('Enter');
        await expect(page).toHaveURL('/auth/local/twoFactor');
        await page.getByLabel('Code').fill('123456');
        await page.getByText('Submit').click();
        await expect(page.getByText('Invalid Authorization Code.')).toBeVisible();
      });
    test('logs in as EMS user with 2FA', async ({ context }) => {
        const appPage = await context.newPage();

        await appPage.goto('/');
        await appPage.getByLabel('Email').fill(process.env.EMS_USER);
        const password = appPage.getByLabel('Password');
        await password.fill(process.env.EMS_PASS);
        await password.press('Enter');

        const allMsgsResponse = await fetch('http://localhost:1080/messages');

        const messages = await allMsgsResponse.json();

        const lastMessageIdx = messages.length;

        const msgResponse = await fetch(`http://localhost:1080/messages/${lastMessageIdx}.plain`);

        const emailText = await msgResponse.text();
    // Use a regular expression to find "Code: " + six-digit number
        const regex = /Code: (\d{6}) \./;
        const foundCode = emailText.match(regex);

        expect(foundCode).not.toBeNull();

        const authCode = foundCode[1];
        const code = appPage.getByLabel('Code')
        await code.fill(authCode);
        await code.press('Enter');

        const pageBody = appPage.locator('body');
        await expect(pageBody).not.toHaveText("Invalid Author")
        await expect(appPage).toHaveURL('/ems');

        // Gracefully close up everything
        await context.close();
      });
      test('logs in as Hospital user with 2FA', async ({ context }) => {
        const appPage = await context.newPage();

        await appPage.goto('/');
        await appPage.getByLabel('Email').fill(process.env.HOSPITAL_USER);
        const password = appPage.getByLabel('Password');
        await password.fill(process.env.HOSPITAL_PASS);
        await password.press('Enter');

        const allMsgsResponse = await fetch('http://localhost:1080/messages');

        const messages = await allMsgsResponse.json();

        const lastMessageIdx = messages.length;

        const msgResponse = await fetch(`http://localhost:1080/messages/${lastMessageIdx}.plain`);

        const emailText = await msgResponse.text();
    // Use a regular expression to find "Code: " + six-digit number
        const regex = /Code: (\d{6}) \./;
        const foundCode = emailText.match(regex);

        expect(foundCode).not.toBeNull();

        const authCode = foundCode[1];
        const code = appPage.getByLabel('Code')
        await code.fill(authCode);
        await code.press('Enter');

        const pageBody = appPage.locator('body');
        await expect(pageBody).not.toHaveText("Invalid Author")
        await expect(appPage).toHaveURL('/er');

        // Gracefully close up everything
        await context.close();
      });
});