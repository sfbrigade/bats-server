import React from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';

import './RingdownBadge.scss';

const { Status } = Ringdown;

const LabelsByStatus = {};
const ModifiersByStatus = {};

// map ringdown status enums to labels to show in the badge, as well as modifier classes to apply to it
[
  ['Sent', 'sent', Status.RINGDOWN_SENT],
  ['Received', 'received', Status.RINGDOWN_RECEIVED],
  ['Confirmed', 'confirmed', Status.RINGDOWN_CONFIRMED],
  ['Arrived', 'arrived', Status.ARRIVED],
  ['Offloaded', 'offloaded', Status.OFFLOADED, Status.OFFLOADED_ACKNOWLEDGED],
  ['Canceled', 'canceled', Status.CANCELLED, Status.CANCEL_ACKNOWLEDGED],
  ['Redirected', 'redirected', Status.REDIRECTED, Status.REDIRECT_ACKNOWLEDGED],
].forEach(([label, modifier, ...keys]) => {
  keys.forEach((key) => {
    LabelsByStatus[key] = label;
    ModifiersByStatus[key] = modifier;
  });
});

export default function RingdownBadge({ status }) {
  const label = LabelsByStatus[status];
  const modifier = ModifiersByStatus[status];

  return <span className={`ringdown-badge ringdown-badge--${modifier}`}>{label}</span>;
}

RingdownBadge.propTypes = {
  status: PropTypes.oneOf(Status.ALL_STATUSES).isRequired,
};
