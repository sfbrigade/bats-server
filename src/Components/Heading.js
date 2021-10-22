import React from 'react';
import PropTypes from 'prop-types';

import './Heading.scss';

function Heading({ title, subtitle, badge, buttonTitle, readOnly }) {
  return (
    <h3 className="usa-accordion__heading heading">
      <div>
        {title}
        {buttonTitle
          ? subtitle && (
              <span>
                {subtitle}{' '}
                <button type="button" className="margin-left-6 padding-105 usa-button" onClick={() => readOnly()}>
                  {buttonTitle}
                </button>
              </span>
            )
          : subtitle && <span>{subtitle}</span>}
      </div>
      {badge && <div className="heading__badge">{badge}</div>}
    </h3>
  );
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
  buttonTitle: PropTypes.string,
  readOnly: PropTypes.func,
};

Heading.defaultProps = {
  subtitle: undefined,
  badge: undefined,
  buttonTitle: undefined,
  readOnly: undefined,
};

export default Heading;
