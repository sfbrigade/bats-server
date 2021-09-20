import React from 'react';
import PropTypes from 'prop-types';

//it is possible this component can go into the component folder.
export default function AdminNavLink({ click, title, isCurrent }){

    return(
        <li className="usa-sidenav__item margin-bottom-9 padding-y-2 margin-left-4">
            <a href="#" onClick={() => click(title)} className={isCurrent ? "usa-current":""}>{title}</a>

        </li>
    )
}
AdminNavLink.propTypes = {
    click: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool.isRequired,
  };