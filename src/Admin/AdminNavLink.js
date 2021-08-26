import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function AdminNavLink({ click, title, isCurrent }){

    const handleClick = () => {
        click(title)
    }

    return(
        <li className="usa-sidenav__item">
            <a href="#" onClick={() => handleClick()} className={isCurrent ? "usa-current":""}>{title}</a>

        </li>
    )
}
AdminNavLink.propTypes = {
    click: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool.isRequired,
  };