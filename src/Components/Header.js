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
      <a className="header__logout h4" href="/auth/local/logout">
        Logout
      </a>
      <h2 className="header__time h4">{now.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}</h2>
      <h1 className="header__name h2">{name}</h1>
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
