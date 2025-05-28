import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ApiService from '../ApiService';
import Context from '../Context';
import Logo from '../assets/img/logomark-150.png';
import './Header.scss';

function Header({ className, name, children }) {
  const { user } = useContext(Context);
  const [hasEvents, setEvents] = useState(false);

  useEffect(() => {
    ApiService.peak.events.index().then((response) => {
      setEvents((response.data?.length ?? 0) > 0);
    });
  }, []);

  return (
    <header className={classNames('header', className)}>
      <img src={Logo} alt={`${name} logo`} className="header__logo" />
      <span className="header__logout h4">
        {hasEvents && (
          <>
            <Link to="/events">Events</Link>&nbsp;|&nbsp;
          </>
        )}
        {user?.isAdminUser && (
          <>
            <Link to="/admin">Admin</Link>&nbsp;|&nbsp;
          </>
        )}
        <a href="/auth/local/logout">Log out</a>
      </span>
      {children}
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};
Header.defaultProps = {
  children: null,
};

export default Header;
