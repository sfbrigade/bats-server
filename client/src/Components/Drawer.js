import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Drawer.scss';

function Drawer({ title, subtitle, children, isOpened, onToggle }) {
  return (
    <div className={classNames('drawer', { 'drawer--opened': isOpened })}>
      <div
        className="drawer__handle"
        onClick={() => onToggle()}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onToggle();
        }}
        role="button"
        tabIndex={0}
      >
        <div className="drawer__title">{title}</div>
        <div className="drawer__prompt">
          {!isOpened && (
            <>
              More info <i className="fas fa-caret-down" />
            </>
          )}
          {isOpened && (
            <>
              Less info <i className="fas fa-caret-up" />
            </>
          )}
        </div>
      </div>
      {subtitle}

      <div className="drawer__content">{children}</div>
    </div>
  );
}

Drawer.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

Drawer.defaultProps = {
  subtitle: undefined,
};

export default Drawer;
