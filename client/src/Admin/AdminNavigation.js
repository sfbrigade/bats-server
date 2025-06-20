import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useResolvedPath } from 'react-router-dom';

import ApiService from '../ApiService';
import Context from '../Context';
import HospitalIcon from '../Components/Icons/Hospital';
import { ReactComponent as OAuthIcon } from '../assets/img/icon-oauth.svg';
import { ReactComponent as MciIcon } from '../assets/img/icon-mci.svg';
import { ReactComponent as SettingsIcon } from '../assets/img/icon-settings.svg';
import { ReactComponent as UserIcon } from '../assets/img/icon-users.svg';
import { ReactComponent as DashboardIcon } from '../assets/img/icon-dashboard.svg';

import './AdminNavigation.scss';

function AdminNavigation() {
  const location = useLocation();
  const { flash } = location.state ?? {};
  window.history.replaceState({}, '');
  const url = useResolvedPath('').pathname;
  const isSiteAdmin = location.pathname.startsWith(`${url}/site`);
  const { user, organization, setOrganization } = useContext(Context);
  const [organizations, setOrganizations] = useState([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (flash) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
    } else {
      setShowFlash(false);
    }
  }, [flash]);

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
    }
  }

  function reset() {
    setOrganization(user.organization);
  }

  return (
    <div className="admin-navigation">
      <div className="admin-navigation__container grid-container">
        <div className="display-flex flex-row flex-justify flex-align-center">
          <div className="display-flex flex-row flex-justify flex-align-center">
            {user?.isSuperUser && !isSiteAdmin && (
              <h2>
                <div className="display-flex flex-align-center">
                  {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                  <select value={organization?.id} onChange={onChangeOrganization} className="usa-select margin-0">
                    {organizations?.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </h2>
            )}
            {(!user?.isSuperUser || isSiteAdmin) && <h2>{organization?.name}</h2>}
          </div>
          <div>
            <span className="margin-right-2">
              Welcome,{' '}
              <Link to={`${url}/users/${user?.id}`} onClick={reset}>
                {user?.firstName} {user?.lastName}
              </Link>
              !
            </span>
            {user?.isSuperUser && isSiteAdmin && (
              <>
                <Link to={url} onClick={reset}>
                  Manage Orgs
                </Link>
                &nbsp;|&nbsp;
              </>
            )}
            {user?.isSuperUser && !isSiteAdmin && (
              <>
                <Link to={`${url}/site`} onClick={reset}>
                  Manage Site
                </Link>
                &nbsp;|&nbsp;
              </>
            )}
            {user?.isOperationalUser && user.organization.type !== 'C4SF' && (
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
          {user?.isSuperUser && isSiteAdmin && (
            <>
              <NavLink
                to={`${url}/site/dashboard`}
                className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
              >
                <DashboardIcon className="admin-navigation__link-icon" /> Dashboard
              </NavLink>
              <NavLink
                to={`${url}/site/clients`}
                className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
              >
                <OAuthIcon variation="outlined" className="admin-navigation__link-icon" /> <span>Clients</span>
              </NavLink>
              <NavLink
                to={`${url}/site/organizations`}
                className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
              >
                <HospitalIcon variation="outlined" className="admin-navigation__link-icon" /> <span>Organizations</span>
              </NavLink>
              <NavLink
                to={`${url}/site/hospitals`}
                className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
              >
                <HospitalIcon variation="outlined" className="admin-navigation__link-icon" /> <span>Hospitals</span>
              </NavLink>
            </>
          )}
          {(!user?.isSuperUser || !isSiteAdmin) && (
            <>
              <NavLink
                to={`${url}/dashboard`}
                className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
              >
                <DashboardIcon className="admin-navigation__link-icon" /> Dashboard
              </NavLink>
              {organization?.type === 'C4SF' && (
                <NavLink
                  to={`${url}/mcis`}
                  className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
                >
                  <MciIcon className="admin-navigation__link-icon" /> MCIs
                </NavLink>
              )}
              {(user?.isAdminUser || user?.isSuperUser) && (
                <NavLink
                  to={`${url}/users`}
                  className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
                >
                  <UserIcon className="admin-navigation__link-icon" /> Users
                </NavLink>
              )}
              {(organization?.type === 'HEALTHCARE' || organization?.type === 'VENUE') && (
                <NavLink
                  to={`${url}/hospitals`}
                  className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
                >
                  <HospitalIcon variation="outlined" className="admin-navigation__link-icon" /> <span>Hospitals</span>
                </NavLink>
              )}
              {(user?.isAdminUser || user?.isSuperUser) && (
                <NavLink
                  to={`${url}/settings`}
                  className={({ isActive }) => `admin-navigation__link ${isActive ? 'admin-navigation__link--active' : ''}`}
                >
                  <SettingsIcon className="admin-navigation__link-icon" /> <span>Settings</span>
                </NavLink>
              )}
            </>
          )}
        </div>
        {showFlash && flash?.info && (
          <div className="admin-navigation__alert usa-alert usa-alert--success usa-alert--slim usa-alert--no-icon">
            <div className="usa-alert__body">
              <p className="usa-alert__text">{flash.info}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavigation;
