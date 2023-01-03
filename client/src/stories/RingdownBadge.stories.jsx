import React from 'react';
import RingdownBadge from "../Components/RingdownBadge";

const Template = (args) => <RingdownBadge {...args} />;

export const sent = Template.bind({
  status: "sent"
});
