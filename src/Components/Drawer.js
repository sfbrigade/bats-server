import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Drawer.scss';

function Drawer({ title, children }) {
  const [isOpened, setOpened] = useState(false);

  return (
    <div className={classNames('drawer', { 'drawer--opened': isOpened })}>
      <div className="drawer__content">{children}</div>
      <div
        className="drawer__handle"
        onClick={() => setOpened(!isOpened)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setOpened(!isOpened);
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
              Collapse <i className="fas fa-caret-up" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Drawer.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default Drawer;
