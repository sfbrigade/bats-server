const TIMEZONES = [
  {
    id: 'Pacific/Honolulu',
    name: 'Hawaii',
  },
  {
    id: 'America/Anchorage',
    name: 'Aleutian',
  },
  {
    id: 'America/Anchorage',
    name: 'Alaska',
  },
  {
    id: 'America/Los_Angeles',
    name: 'Pacific',
  },
  {
    id: 'America/Phoenix',
    name: 'Arizona',
  },
  {
    id: 'America/Denver',
    name: 'Mountain',
  },
  {
    id: 'America/Chicago',
    name: 'Central',
  },
  {
    id: 'America/New_York',
    name: 'Eastern',
  },
];
Object.freeze(TIMEZONES);

class TimeZone {
  static get ALL_TIMEZONES() {
    return TIMEZONES;
  }
}
export default TimeZone;
