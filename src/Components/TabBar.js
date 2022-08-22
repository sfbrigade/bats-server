import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './TabBar.scss';

function TabBar({ onSelect, selectedTab, tabs }) {
  const children = tabs.map(({ label, Icon }, i) => {
    const isSelected = i === selectedTab;

    return (
      <button
        key={label}
        type="button"
        className={classNames(
          '.usa-button',
          'tabbar__tab',
          {
            'tabbar__tab--selected': isSelected,
          },
          'h4'
        )}
        onClick={() => onSelect(i)}
      >
        {Icon && <Icon className="tabbar__icon" variation={isSelected ? 'filled' : 'outlined'} />}
        {label}
      </button>
    );
  });

  return <div className="tabbar">{children}</div>;
}

TabBar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedTab: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, Icon: PropTypes.elementType })).isRequired,
};

export default TabBar;
