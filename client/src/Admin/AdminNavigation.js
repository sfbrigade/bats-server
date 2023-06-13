import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom';

import ApiService from '../ApiService';
import Context from '../Context';
import HospitalIcon from '../Components/Icons/Hospital';
import { ReactComponent as SettingsIcon } from '../assets/img/icon-settings.svg';

import './AdminNavigation.scss';

function AdminNavigation() {
  const { location } = useHistory();
  const { url } = useRouteMatch();
  const { user, organization, setOrganization, hospital, setHospital } = useContext(Context);
  const [organizations, setOrganizations] = useState([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (location.state?.flash) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
    } else {
      setShowFlash(false);
    }
  }, [location]);

  useEffect(() => {
    if (user?.isSuperUser) {
      ApiService.organizations.index().then((response) => setOrganizations(response.data));
    }
  }, [user]);

  function onChangeOrganization(event) {
    const organizationId = event.target.value;
    const newOrganization = organizations.find((o) => o.id === organizationId);
    if (newOrganization) {
      setOrganization(newOrganization);
      if (newOrganization.type === 'HEALTHCARE') {
        setHospital(newOrganization.hospitals[0]);
      } else {
        setHospital();
      }
    }
  }

  function reset() {
    setOrganization(user.organization);
    if (user.organization.type === 'HEALTHCARE') {
      setHospital(user.activeHospitals[0].hospital);
    } else {
      setHospital();
    }
  }

  return (
    <div className="admin-navigation">
      <div className="admin-navigation__container grid-container">
        <div className="display-flex flex-row flex-justify">
          <div>
            {user?.isSuperUser && (
              <h2 className="admin-navigation__name">
                <div className="display-flex flex-align-center">
                  {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                  <select value={organization?.id} onChange={onChangeOrganization} className="usa-select">
                    {organizations?.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </h2>
            )}
            {!user?.isSuperUser && (
              <h2 className="admin-navigation__name">
                {organization?.name}
                {hospital && <>&nbsp;&gt;&nbsp;&nbsp;{hospital.name}</>}
              </h2>
            )}
            Welcome,{' '}
            <Link to={`${url}/users/${user?.id}`} onClick={reset}>
              {user?.firstName} {user?.lastName}
            </Link>
            !
          </div>
          <div className="admin-navigation__logout">
            {user?.isOperationalUser && (
              <>
                <Link to="/" onClick={reset}>
                  Exit Admin
                </Link>
                &nbsp;|&nbsp;
              </>
            )}
            <a href="/auth/local/logout">Logout</a>
          </div>
        </div>
        <div className="display-flex flex-row flex-justify-center">
          <NavLink to={`${url}/dashboard`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Dashboard
          </NavLink>
          <NavLink to={`${url}/users`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Users
          </NavLink>
          {organization.type === "HEALTHCARE" && 
          <NavLink to={`${url}/hospitals`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            <HospitalIcon variation='outlined' className="admin-navigation__link-icon"/> <span>Hospitals</span> 
          </NavLink>
          }
          <NavLink to={`${url}/settings`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            <SettingsIcon/> <span>Settings</span>
          </NavLink>
          {/* <NavLink to={`${url}/ringdowns`} className="admin-navigation__link" activeClassName="admin-navigation__link--active">
            Ringdowns
          </NavLink> */}
        </div>
        {showFlash && location.state?.flash?.info && (
          <div className="admin-navigation__alert usa-alert usa-alert--success usa-alert--slim usa-alert--no-icon">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{location.state.flash.info}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavigation;
