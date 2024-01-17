const { test, expect } = require('@playwright/test');

test.describe('ER status', () => {
  test.describe.configure({ mode: 'serial' });
  let numberErBeds = 0;
  let numberBehaviorBeds = 0;

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
    const erBedsRow = appPage.getByTestId('counter_openEdBedCount');
    numberErBeds = parseInt(await erBedsRow.getByRole('textbox').inputValue(), 10);
    for (let i = 0; i < 5; i++) {
      await erBedsRow.getByRole('button', { name: '+' }).click();
      numberErBeds++;
    }

    const behaviorNode = appPage.getByLabel(/behavioral beds/i);
    const behaviorBedsRow = appPage.getByTestId('counter_openPsychBedCount');
    numberBehaviorBeds = parseInt(await behaviorNode.inputValue(), 10);
    for (let i = 0; i < 8; i++) {
      await behaviorBedsRow.getByRole('button', { name: '+' }).click();
      numberBehaviorBeds++;
    }
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
    await expect(ucsfRow.locator('.hospitalstatusrow__data').filter({ hasText: `${numberErBeds}` })).toBeVisible();
    await expect(ucsfRow.locator('.hospitalstatusrow__data').filter({ hasText: `${numberBehaviorBeds}` })).toBeVisible();
    await expect(ucsfRow.getByText('scanner broke')).toBeVisible();
    await context.close();
  });

  test('Decrement beds in ER back to 0', async ({ context }) => {
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
    const erBedsRow = appPage.getByTestId('counter_openEdBedCount');
    numberErBeds = parseInt(await erBedsRow.getByRole('textbox').inputValue(), 10);
    while (numberErBeds >= 0) {
      await erBedsRow.getByTestId('decrement').click();
      numberErBeds--;
    }
    const erBedValue = await appPage.getByRole('textbox', { name: /er beds/i }).inputValue();
    expect(erBedValue).toBe('0');

    const behaviorBedsRow = appPage.getByTestId('counter_openPsychBedCount');
    numberBehaviorBeds = parseInt(await behaviorBedsRow.getByRole('textbox').inputValue(), 10);
    while (numberBehaviorBeds >= 0) {
      await behaviorBedsRow.getByTestId('decrement').click();
      numberBehaviorBeds--;
    }
    expect(await appPage.getByRole('textbox', { name: /behavioral beds/i }).inputValue()).toBe('0');
    await appPage.locator('#additionalNotes').fill('');
    await appPage.getByRole('button', { name: /confirm/i }).click();
  });

  test('Hospital status matches latest changes after decrementing', async ({ context }) => {
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
