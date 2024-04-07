import { Navigate, Route, Routes } from 'react-router-dom';

import SiteDashboard from './SiteDashboard';
import OrganizationsRoutes from './Organizations/OrganizationsRoutes';

function SiteRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<SiteDashboard />} />
      <Route path="organizations/*" element={<OrganizationsRoutes />} />
      <Route path="" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default SiteRoutes;
