import PropTypes from 'prop-types';

import { ReactComponent as Outlined } from '../../assets/img/icon-phone-outlined.svg';
import { ReactComponent as Filled } from '../../assets/img/icon-phone-filled.svg';

const variations = {
  outlined: Outlined,
  filled: Filled,
};

export default function Phone({ variation, className }) {
  const Icon = variations[variation];

  return <Icon className={className} />;
}

Phone.propTypes = {
  variation: PropTypes.oneOf(Object.keys(variations)),
  className: PropTypes.string,
};
Phone.defaultProps = {
  variation: 'outlined',
  className: '',
};
