import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as Outlined } from '../../assets/img/icon-hospital-outlined.svg';
import { ReactComponent as Filled } from '../../assets/img/icon-hospital-filled.svg';

const variations = {
  outlined: Outlined,
  filled: Filled,
};

export default function Hospital({ variation, className }) {
  const Icon = variations[variation];

  return <Icon className={className} />;
}

Hospital.propTypes = {
  variation: PropTypes.oneOf(Object.keys(variations)),
  className: PropTypes.string,
};
Hospital.defaultProps = {
  variation: 'outlined',
  className: '',
};
