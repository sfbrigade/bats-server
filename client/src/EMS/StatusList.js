import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './StatusList.scss';

export function StatusList({ children }) {
  return <ol className="status-list">{children}</ol>;
}

StatusList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export function StatusStep({ isActive, isCompleted, active, inactive }) {
  return (
    <li className={classNames('status-list-item', { 'status-list-item--completed': isCompleted })}>
      <div className="status-list-item__icon" />
      <div className="status-list-item__text">{isActive && !isCompleted ? active : inactive}</div>
    </li>
  );
}

StatusStep.propTypes = {
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  active: PropTypes.node,
  inactive: PropTypes.node,
};

StatusStep.defaultProps = {
  isActive: false,
  isCompleted: false,
  active: null,
  inactive: null,
};

export function StatusButton({ label, status, onClick }) {
  return (
    <button type="button" className="usa-button usa-button--primary width-full" onClick={() => onClick(status)}>
      {label}
    </button>
  );
}

StatusButton.propTypes = {
  label: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
