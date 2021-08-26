import React, { useState } from 'react';
import PropTypes from 'prop-types';

//it is possible this component can go into the component folder.
export default function AdminNavLink({ click, title, isCurrent }){

    return(
        <li className="usa-sidenav__item">
            <a href="#" onClick={() => click(title)} className={isCurrent ? "usa-current":""}>{title}</a>

        </li>
    )
}
AdminNavLink.propTypes = {
    click: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool.isRequired,
  };