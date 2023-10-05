const { test, expect } = require('@playwright/test');

test.describe('ER status', () => {
  test.describe.configure({ mode: 'serial' });
  test('Update ER status', async ({ context }) => {
    const appPage = await context.newPage();
    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('ucsf.parnassus.er@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(appPage).toHaveURL('/er');
    await appPage.reload();
    await appPage.getByRole('button', { name: /hospital/i }).click();
    await expect(appPage.getByText(/available beds/i)).toBeVisible();
    await expect(appPage.getByText(/er conditions/i)).toBeVisible();
    await appPage.getByRole('button', { name: /update hospital/i }).click();
    await appPage.getByRole('textbox', { name: /er beds/i }).fill('5');
    await appPage.getByRole('textbox', { name: /behavioral beds/i }).fill('8');
    await appPage.locator('#additionalNotes').fill('scanner broke');
    await appPage.getByRole('button', { name: /confirm/i }).click();
  });

  test('EMS checks hospital status', async ({ context }) => {
    const appPage = await context.newPage();
    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('op.ems.1@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(appPage).toHaveURL('/ems');
    await appPage.getByRole('button', { name: /hospital info/i }).click();
    const ucsfRow = appPage.locator('.hospitalstatusrow_container').filter({ hasText: /ucsf parnassus/i });
    await expect(ucsfRow.locator('.hospitalstatusrow__data').filter({ hasText: '5' })).toBeVisible();
    await expect(ucsfRow.locator('.hospitalstatusrow__data').filter({ hasText: '8' })).toBeVisible();
    await expect(ucsfRow.getByText('scanner broke')).toBeVisible();
    await context.close();
  });

  test('Update ER status reset', async ({ context }) => {
    const appPage = await context.newPage();
    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('ucsf.parnassus.er@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(appPage).toHaveURL('/er');
    await appPage.reload();
    await appPage.getByRole('button', { name: /hospital/i }).click();
    await expect(appPage.getByText(/available beds/i)).toBeVisible();
    await expect(appPage.getByText(/er conditions/i)).toBeVisible();
    await appPage.getByRole('button', { name: /update hospital/i }).click();
    await appPage.getByRole('textbox', { name: /er beds/i }).fill('0');
    await appPage.getByRole('textbox', { name: /behavioral beds/i }).fill('0');
    await appPage.locator('#additionalNotes').fill('');
    await appPage.getByRole('button', { name: /confirm/i }).click();
  });

  test('EMS checks hospital status after reset', async ({ context }) => {
    const appPage = await context.newPage();
    await appPage.goto('/');
    await appPage.getByLabel('Email').fill('op.ems.1@c4sf.me');
    const password = appPage.getByLabel('Password');
    await password.fill('abcd1234');
    await password.press('Enter');
    await expect(appPage).toHaveURL('/ems');
    await appPage.getByRole('button', { name: /hospital info/i }).click();
    const row = appPage.locator('.hospitalstatusrow_container', { hasText: /ucsf parnassus/i });
    await expect(row.locator('.hospitalstatusrow__data', { hasText: '5' })).not.toBeVisible();
    await expect(row.locator('.hospitalstatusrow__data', { hasText: '8' })).not.toBeVisible();
    await expect(row.locator('.hospitalstatusrow__notes', { hasText: 'scanner broke' })).not.toBeVisible();
    await context.close();
  });
});
