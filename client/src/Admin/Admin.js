import React from 'react';
import { Routes, Navigate, Route, useResolvedPath } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import Dashboard from './Dashboard';
import Ringdowns from './Ringdowns/Ringdowns';
import Users from './Users/Users';

export default function Admin() {
  const path = useResolvedPath("").pathname;

  return (
    <>
      <AdminNavigation />
      <div className="grid-container">
        <Routes>
          <Route path={`${path}/dashboard`} element={<Dashboard />} />
          <Route path={`${path}/users/:userId?`} element={<Users />} />
          <Route path={`${path}/ringdowns`} element={<Ringdowns />} />
          <Route path={path} element={<Navigate to={`${path}/dashboard`} />} />
          {/* <Route path={`${path}/dashboard`}>
            <Dashboard />
          </Route>
          <Route path={`${path}/users/:userId?`}>
            <Users />
          </Route>
          <Route path={`${path}/ringdowns`}>
            <Ringdowns />
          </Route>
          <Route exact path={path}>
            <Navigate to={`${path}/dashboard`} />
          </Route> */}
        </Routes>
      </div>
    </>
  );
}
