const { test, expect } = require('@playwright/test');

const SMTP_HOST = process.env.SMTP_HOST;

test.beforeEach(async ({ request }) => {
  await request.delete(`http://${SMTP_HOST}:1080/messages`);
});

test.describe('Reset Password', () => {
  test('login page has a link to the forgot password page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forgot your password?').click();
    await expect(page).toHaveURL('/forgot');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByText('Send Reset Link')).toBeVisible();
  });

  test('sends an email with a reset password link', async ({ page, request }) => {
    await page.goto('/forgot');
    await page.getByLabel('Email').fill('op.ems@c4sf.me');
    await page.getByText('Send Reset Link').click();
    await expect(
      page.getByText('Please check your email for a reset password link. It may take a few minutes for the email to arrive.')
    ).toBeVisible();
    await page.waitForTimeout(200);

    const messages = await request.get(`http://${SMTP_HOST}:1080/messages`).then((response) => response.json());
    expect(messages.length).toBe(1);
    const text = await request.get(`http://${SMTP_HOST}:1080/messages/${messages[0].id}.plain`).then((response) => response.text());

    const m = text.match(/\/reset\?[^\r\n]+/);
    expect(m).toBeTruthy();

    await page.goto(m[0]);
    await page.getByLabel('Password').fill('Abcd1234!');
    // TODO: figure out why getByLabel doesn't work with the Confirm Password label/input
    await page.getByTestId('confirm').fill('Abcd1234!');
    await page.getByText('Reset Password').click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Your password has been reset and you may log in using your new password.')).toBeVisible();

    await page.getByLabel('Email').fill('op.ems@c4sf.me');
    await page.getByLabel('Password').fill('Abcd1234!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/ems');
  });
});
