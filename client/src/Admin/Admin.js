import React from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import Dashboard from './Dashboard';
import Ringdowns from './Ringdowns/Ringdowns';
import Users from './Users/Users';

export default function Admin() {
  return (
    <>
      <AdminNavigation />
      <div className="grid-container">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users/:userId?" element={<Users />} />
          <Route path="ringdowns" element={<Ringdowns />} />
          <Route path="" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </>
  );
}
