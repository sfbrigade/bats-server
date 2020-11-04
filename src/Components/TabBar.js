import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './TabBar.scss';

function TabBar({ onSelect, tabs }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onClick = (index) => {
    setSelectedIndex(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const children = [];
  for (let i = 0; i < tabs.length; i += 1) {
    children.push(
      <button
        key={i}
        type="button"
        className={classNames('tabbar__tab', {
          'tabbar__tab--selected': i === selectedIndex,
          'tabbar__tab--beforeselected': i === selectedIndex - 1,
        })}
        onClick={() => onClick(i)}
      >
        <div className="tabbar__tabcontent">{tabs[i]}</div>
      </button>
    );
  }

  return <div className="tabbar">{children}</div>;
}
TabBar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default TabBar;
