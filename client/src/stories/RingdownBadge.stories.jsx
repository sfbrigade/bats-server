import React from 'react';
import RingdownBadge from "../Components/RingdownBadge";
import DeliveryStatus from '../../../shared/constants/DeliveryStatus';

const metadata = {
  title: 'Routed/Badge',
  component: RingdownBadge,
  argTypes: {
    status: {
      options: DeliveryStatus.ALL_STATUSES,
      control: 'select'
    },
  },
};

export default metadata;

function story(args = {}, Component = metadata.component) {
	const func = (args) => <Component {...args} />;

  func.args = args;

  return func;
}

export const Sent = story({ status: DeliveryStatus.RINGDOWN_SENT });
export const Confirmed = story({ status: DeliveryStatus.RINGDOWN_CONFIRMED });
export const Arrived = story({ status: DeliveryStatus.ARRIVED });
export const Offloaded = story({ status: DeliveryStatus.OFFLOADED });
