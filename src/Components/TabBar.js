import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './TabBar.scss';

function TabBar({ onSelect, selectedTab, tabs }) {
  const children = [];
  for (let i = 0; i < tabs.length; i += 1) {
    children.push(
      <button
        key={i}
        type="button"
        className={classNames(
          'tabbar__tab',
          {
            'tabbar__tab--selected': i === selectedTab,
          },
          'h4'
        )}
        onClick={() => onSelect(i)}
      >
        {tabs[i]}
      </button>
    );
  }

  return <div className="tabbar">{children}</div>;
}
TabBar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedTab: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default TabBar;
