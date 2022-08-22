import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as Outlined } from '../../assets/img/icon-ringdown-outlined.svg';
import { ReactComponent as Filled } from '../../assets/img/icon-ringdown-filled.svg';

const variations = {
  outlined: Outlined,
  filled: Filled,
};

export default function Ringdown({ variation, className }) {
  const Icon = variations[variation];

  return <Icon className={className} />;
}

Ringdown.propTypes = {
  variation: PropTypes.oneOf(Object.keys(variations)),
  className: PropTypes.string,
};
Ringdown.defaultProps = {
  variation: 'outlined',
  className: '',
};
