import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Card({ className, header, body, children }) {
  return (
    <div className={classNames('usa-card__container height-auto', className)}>
      <div className="usa-card__header">{header}</div>
      <div className="usa-card__body flex-auto">{body}</div>
      <div className="usa-card__footer">{children}</div>
    </div>
  );
}
Card.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  children: PropTypes.node,
};
Card.defaultProps = {
  className: null,
  children: null,
};
export default Card;
