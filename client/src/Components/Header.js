import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Context from '../Context';
import Logo from '../assets/img/logomark-150.png';
import './Header.scss';

function Header({ name, children }) {
  const { user } = useContext(Context);

  return (
    <header className="header">
      <img src={Logo} alt={`${name} logo`} className="header__logo" />
      <span className="header__logout h4">
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
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};
Header.defaultProps = {
  children: null,
};

export default Header;
