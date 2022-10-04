// get the .env from the root of the project, above the current /client directory
require('dotenv').config({ path: '../.env' });

if (!process.env.EMS_USER) {
  console.error("=============\nCan't find .env file\n=============\n");
}

const fillEMS = [
  ['#username', process.env.EMS_USER],
  ['#password', process.env.EMS_PASS],
];

const fillHospital = [
  ['#username', process.env.HOSPITAL_USER],
  ['#password', process.env.HOSPITAL_PASS],
];

async function cancelIfNecessary({ page }) {
  await page.waitForTimeout(250);
  const cancelButton = await page.locator('button:has-text("Cancel delivery")');
  const returnButton = await page.locator('button:has-text("Return to service")');
  const startButton = await page.locator('button:has-text("Start new form")');
  const cancelButtonExists = await cancelButton.count() === 1 && await cancelButton.isVisible();

  if (cancelButtonExists) {
//  if (await cancelButton.isVisible()) {
    await cancelButton.click();
    await page.locator('text=Yes, cancel delivery').click();
    await page.waitForTimeout(100);
  }

  const returnButtonExists = await returnButton.count() > 0;

  if (returnButtonExists) {
    await returnButton.click();
  }

  if (await startButton.isVisible()) {
    await startButton.click();
  }
}

module.exports = {
  fillEMS,
  fillHospital,
  loginEMS: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ...fillEMS,
    ['"Login"', ['click']],
    cancelIfNecessary,
  ],
  loginHospital: [
    [['goto', '/auth/local/logout']],
    [['goto', '/auth/local/login']],
    ...fillHospital,
    ['"Login"', ['click']],
    cancelIfNecessary,
  ],
};
