import React from 'react';
import PropTypes from 'prop-types';

import './Heading.scss';

function Heading({ title, subtitle, badge, children }) {
  return (
    <h3 className="usa-accordion__heading heading">
      <div>
        {title}
        {subtitle && <span>{subtitle}</span>}
      </div>
      {badge && <div className="heading__badge">{badge}</div>}
      {children}
    </h3>
  );
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
  children: PropTypes.node,
};

Heading.defaultProps = {
  subtitle: undefined,
  badge: undefined,
  children: undefined,
};

export default Heading;
