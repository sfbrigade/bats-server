import React from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import Dashboard from './Dashboard';
import Ringdowns from './Ringdowns/Ringdowns';
import Users from './Users/Users';
import Hospitals from './Hospitals';
import Settings from './Settings';
import SiteRoutes from './Site/SiteRoutes';

export default function Admin() {
  return (
    <>
      <AdminNavigation />
      <div className="grid-container">
        <Routes>
          <Route path="site/*" element={<SiteRoutes />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ringdowns" element={<Ringdowns />} />
          <Route path="users/:userId?" element={<Users />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="settings" element={<Settings />} />
          <Route path="" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </>
  );
}
