import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import './Header.scss';

function Header({ name, children }) {
  const [now, setNow] = useState(DateTime.local());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="header">
      <h1 className="header__name">{name}</h1>
      <h2 className="header__time">
        {now.toFormat('h:mm:ss')} <span>{now.toFormat('a')}</span>
      </h2>
      {children}
    </div>
  );
}
Header.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};
Header.defaultProps = {
  children: null,
};
export default Header;
