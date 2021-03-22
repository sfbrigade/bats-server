import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Alert.scss';

function Alert({ className, type, title, message, cancel, primary, destructive, onCancel, onPrimary, onDestructive }) {
  return (
    <div className={classNames('alert', className)}>
      <div className="alert__content">
        <div className={`usa-alert usa-alert--${type}`}>
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">{title}</h3>
            <p className="usa-alert__text">{message}</p>
          </div>
          <ul className="usa-button-group">
            {cancel && (
              <li className="usa-button-group__item">
                <button type="button" className="usa-button usa-button--outline bg-white" onClick={onCancel}>
                  {cancel}
                </button>
              </li>
            )}
            {destructive && (
              <li className="usa-button-group__item">
                <button type="button" className="usa-button usa-button--secondary" onClick={onDestructive}>
                  {destructive}
                </button>
              </li>
            )}
            {primary && (
              <li className="usa-button-group__item">
                <button type="button" className="usa-button width-mobile" onClick={onPrimary}>
                  {primary}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

Alert.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  cancel: PropTypes.string,
  primary: PropTypes.string,
  destructive: PropTypes.string,
  onCancel: PropTypes.func,
  onPrimary: PropTypes.func,
  onDestructive: PropTypes.func,
};

Alert.defaultProps = {
  className: undefined,
  cancel: undefined,
  primary: undefined,
  destructive: undefined,
  onCancel: undefined,
  onPrimary: undefined,
  onDestructive: undefined,
};

export default Alert;
