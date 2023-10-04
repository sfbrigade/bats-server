const { test, expect } = require('@playwright/test');

const cancelRingdown = async (page) => {
  await page.getByText('Cancel delivery').click();

  await expect(page.getByText('hospital will be notified')).toBeVisible();

  await page.getByText('Yes, cancel delivery').click();

  await expect(page.getByText('Delivery canceled')).toBeVisible();

  await page.getByText('Start new form').click();
};

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

    const ringdownPresent = await emsPage.getByText('Ringdown sent');
    if ((await ringdownPresent.count()) > 0) {
      await cancelRingdown(emsPage);
    }

    await erPage.goto('/');
    await erPage.getByLabel('Email').fill(process.env.HOSPITAL_USER);
    const erPassword = erPage.getByLabel('Password');
    await erPassword.fill(process.env.HOSPITAL_PASS);
    await erPassword.press('Enter');
    await expect(erPage).toHaveURL('/er');
  });

  test('Submits a ringdown', async ({ browser }) => {
    // TODO: move this into beforeEach once this works

    const unitComboBox = emsPage.locator('#ambulanceIdentifier');

    await unitComboBox.click();

    const ambulanceIdentifierList = emsPage.locator('#ambulanceIdentifier--list');

    await ambulanceIdentifierList.getByText('SFFD-2').click();

    const incidentComboBox = emsPage.locator('#dispatchCallNumber');

    await incidentComboBox.fill('2');

    await incidentComboBox.press('Enter');

    await expect(emsPage.locator('[name=dispatchCallNumber]')).toHaveValue('2');

    await emsPage.getByText('Code 2').click();

    await expect(emsPage.locator('[value="CODE 2"]')).toBeChecked();

    const ageBox = emsPage.locator('#age');

    await ageBox.fill('25');
    await expect(ageBox).toHaveValue('25');

    await emsPage.getByText('Non-binary').click();

    await expect(emsPage.locator('[value="NON-BINARY"]')).toBeChecked();

    const chiefComplaintBox = emsPage.locator('#chiefComplaintDescription');

    const complaintText = 'Patient ate too many skittles. They are experiencing severe regretitis';

    await chiefComplaintBox.fill(complaintText);

    await expect(chiefComplaintBox).toHaveValue(complaintText);

    await emsPage.getByText('Vitals stable').click();

    await expect(emsPage.locator('#stableIndicator-true')).toBeChecked();

    const systolicBox = emsPage.locator('#systolicBloodPressure');

    await systolicBox.fill('130');
    await expect(systolicBox).toHaveValue('130');

    const diastolicBox = emsPage.locator('#diastolicBloodPressure');

    await diastolicBox.fill('80');
    await expect(diastolicBox).toHaveValue('80');

    const pulseBox = emsPage.locator('#heartRateBpm');

    await pulseBox.fill('85');
    await expect(pulseBox).toHaveValue('85');

    const respiratoryBox = emsPage.locator('#respiratoryRate');

    await respiratoryBox.fill('20');
    await expect(respiratoryBox).toHaveValue('20');

    const oxygenBox = emsPage.locator('#oxygenSaturation');

    await oxygenBox.fill('40');
    await expect(oxygenBox).toHaveValue('40');

    await emsPage.getByText('Room Air').click();

    await expect(emsPage.locator('[value="ROOM AIR"]')).toBeChecked();

    const temperatureBox = emsPage.locator('#temperature');

    await temperatureBox.fill('98');
    await expect(temperatureBox).toHaveValue('98');

    const treatmentNotesBox = emsPage.locator('#treatmentNotes');

    const treatmentNoteText = 'N/A';

    await treatmentNotesBox.fill(treatmentNoteText);
    await expect(treatmentNotesBox).toHaveText(treatmentNoteText);

    await emsPage.getByText('COVID-19 suspected').click();

    await expect(emsPage.locator('#covid19SuspectedIndicator-true')).toBeChecked();

    const otherObservationsBox = emsPage.locator('#otherObservationNotes');

    const otherText = 'Patient is a fan of 90s grunge music';

    await otherObservationsBox.fill(otherText);
    await expect(otherObservationsBox).toHaveText(otherText);

    await emsPage.getByText('Select Hospital').click();

    await expect(emsPage.getByText('Hospital Selection')).toBeVisible();

    await emsPage.locator('label').filter({ hasText: 'CPMC Van Ness' }).click();

    await expect(emsPage.locator('label').filter({ hasText: 'CPMC Van Ness' })).toBeChecked();

    const etaBox = emsPage.locator('#etaMinutes');

    await etaBox.fill('10');
    await expect(etaBox).toHaveValue('10');

    await emsPage.getByText('Send Ringdown').click();

    await expect(emsPage.getByText('Ringdown sent')).toBeVisible();
  });

  test.afterEach(async ({ browser }) => {
    erPage.close();
    emsPage.close();
    erContext.close();
    emsContext.close();
    browser.close();
  });
});
