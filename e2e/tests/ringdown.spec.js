const { test, expect } = require('@playwright/test');
test.describe('Initializing ringdowns', () => {
  test('redirects to EMS interface after EMS user login', async ({ browser }) => {
    const emsContext = await browser.newContext();
    const erContext = await browser.newContext();

    const emsPage = await emsContext.newPage();
    const erPage = await erContext.newPage();

    await emsPage.goto('/');
    await emsPage.getByLabel('Email').fill(process.env.EMS_USER);
    const emsPassword = emsPage.getByLabel('Password');
    await emsPassword.fill(process.env.EMS_PASS);
    await emsPassword.press('Enter');
    await expect(emsPage).toHaveURL('/ems');

    await erPage.goto('/');
    await erPage.getByLabel('Email').fill(process.env.HOSPITAL_USER);
    const erPassword = erPage.getByLabel('Password');
    await erPassword.fill(process.env.HOSPITAL_PASS);
    await erPassword.press('Enter');
    await expect(erPage).toHaveURL('/er');
  });
});
