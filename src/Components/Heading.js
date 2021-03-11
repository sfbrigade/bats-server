import React from 'react';
import PropTypes from 'prop-types';

import './Heading.scss';

const Heading = ({ title, subtitle, badge }) => {
  return (
    <h3 className="usa-accordion__heading heading">
      <div>
        {title}
        {subtitle && <span>{subtitle}</span>}
      </div>
      {badge && <div className="heading__badge">{badge}</div>}
    </h3>
  );
};

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
};

Heading.defaultProps = {
  subtitle: undefined,
  badge: undefined,
};

export default Heading;
