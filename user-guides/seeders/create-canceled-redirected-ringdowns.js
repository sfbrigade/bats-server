const database = require('../src/database');

(async () => {
  // clear out any existing ringdowns before adding new ones
  await database.resetRingdowns();

  await database.addRingdown({
    user: {
      email: 'op.ems.1@c4sf.me',
      unit: 'SFFD-1',
    },
    call: {
      status: database.DeliveryStatus.CANCELLED,
      destination: 'SF General',
    },
    patient: {
      age: 30,
      sex: 'MALE',
      emergencyServiceResponseType: 'CODE 2',
      chiefComplaintDescription: 'Fainted while walking home.',
      stableIndicator: true,
    },
  });

  await database.addRingdown({
    user: {
      email: 'op.ems.1@c4sf.me',
      unit: 'SFFD-1',
    },
    call: {
      status: database.DeliveryStatus.REDIRECTED,
      destination: 'SF General',
    },
    patient: {
      age: 30,
      sex: 'MALE',
      emergencyServiceResponseType: 'CODE 2',
      chiefComplaintDescription: 'Head injury. Loss of consciousness.',
      stableIndicator: true,
    },
  });
})();
