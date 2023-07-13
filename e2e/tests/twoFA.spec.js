const { test, expect, chromium  } = require('@playwright/test');

test.describe('home', () => { // Must be run as last test so that last email contains correct authorization code
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

        /*  Match time of email to time of clicking submit. Doesn't exactly work due to test workers running parallel

        const currentDateTime = new Date().toISOString().slice(0, -5) + "+00:00";
        console.log(currentDateTime);

        const allMsgsResponse = await fetch('http://localhost:1080/messages');

        const messages = await allMsgsResponse.json();

        const messageIdx = parseInt(messages.find((msg) => msg["created_at"] === currentDateTime).id);

        const msgResponse = await fetch(`http://localhost:1080/messages/${messageIdx}.plain`);

        */

        const emailText = await msgResponse.text();
    // Use a regular expression to find "Code: " + six-digit number
    const regex = /Code: (\d{6}) \./;
    const foundCode = emailText.match(regex);

    expect(foundCode).not.toBeNull();

    const authCode = foundCode[1];

    console.log(authCode);

    const code = appPage.getByLabel('Code')
    await code.fill(authCode);
    await code.press('Enter');

    const pageBody = appPage.locator('body');
    await expect(pageBody).not.toHaveText("Invalid Author")
    await expect(appPage).toHaveURL('/ems');

     // Gracefully close up everything
    await context.close();
      });
});