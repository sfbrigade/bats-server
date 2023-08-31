const { test, expect } = require('@playwright/test');

let emsContext, erContext;
let erPage, emsPage;
test.describe('Initializing ringdowns', () => {
  test.beforeEach(async ({ browser }) => {
    emsContext = await browser.newContext();
    erContext = await browser.newContext();

    emsPage = await emsContext.newPage();
    erPage = await erContext.newPage();

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

  test('Submits a ringdown', async ({ browser }) => {
    // TODO: move this into beforeEach once this works

    const unitDropdown = emsPage.locator('id=ambulanceIdentifier-label');
    // this isn't working yet (WIP)

    await unitDropdown.getByLabel(/Toggle the dropdown/).click();

    await expect(unitDropdown.getByText('SFFD-2')).toBeVisible();

    await emsPage.getByLabel('Unit #').selectOption('SFFD-2');
  });

  test.afterEach(async ({ browser }) => {
    erPage.close();
    emsPage.close();
    erContext.close();
    emsContext.close();
    browser.close();
  });
});
