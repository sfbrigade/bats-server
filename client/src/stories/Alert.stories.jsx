import React from 'react';
import Alert from '../Components/Alert';

const metadata = {
  component: Alert,
  argTypes: {},
};

export default metadata;

function story(args = {}, Component = metadata.component) {
  const func = (args) => <Component {...args} />;

  func.args = args;

  return func;
}

export const Warning = story({
  type: 'warning',
  title: 'Clear form?',
  message: 'All of the fields will be reset.',
  destructive: 'Clear form',
  cancel: 'Keep editing',
});
