const { loginEMS } = require('../src/snippets');

module.exports = {
  title: 'Tracking Progress',
  script: [
    ...loginEMS,
    ['"Unit #"', ['click']],
    ['li[role="option"]:has-text("SFFD-1")', ['click']],
    ['"Incident #"', ['click']],
    [['press', 'body', 'Enter']],
    ['"Code 2"', ['click']],
    ['"Age (estimated)"', 58],
    ['"Male"', ['click']],
    ['#chiefComplaintDescription', 'Chest pain'],
    ['"Vitals stable"', ['click']],
    ['"Select Hospital"', ['click']],
    ['label:has-text("SF General")', ['click']],
    ['"ETA"', 12],
    ['text=Send ringdown', ['click']],
    ['text=Redirect patient', ['click']],

    ({ screenshot }) => screenshot(
      'If you need to redirect the patient to a different destination, click Redirect patient, then click Choose new destination to confirm.'
    ),

    ['text=Keep destination', ['click']],
    ['text=Cancel delivery', ['click']],

    ({ screenshot }) => screenshot(
      'If you need to cancel the transport, click Cancel delivery, then click Yes, cancel delivery to confirm.'
    ),

    ['text=No, don\'t cancel', ['click']],

    ({ screenshot }) => screenshot(
      'Otherwise, when you have arrived at the destination, click Mark arrived.'
    ),

    ['text=Mark arrived', ['click']],

    ({ screenshot }) => screenshot(
      'When you have transferred the patient to the hospital, click Mark offloaded.'
    ),

    ['text=Mark offloaded', ['click']],

    ({ screenshot }) => screenshot(
      'When you are ready to begin your next run, click Return to service.  This will return you to the empty Ringdown tab.'
    ),
  ]
};
