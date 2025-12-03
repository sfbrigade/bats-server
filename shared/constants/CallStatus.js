const CallStatus = {
  RINGING: 'ringing',
  ACKNOWLEDGED: 'acknowledged',
  ANSWERED: 'answered',
  CANCELLED: 'cancelled',
};

CallStatus.ALL_STATUSES = Object.values(CallStatus);

CallStatus.is = (status, target) => CallStatus.ALL_STATUSES.indexOf(status) >= CallStatus.ALL_STATUSES.indexOf(target);

module.exports = Object.freeze(CallStatus);
