import { Navigate, Route, Routes } from 'react-router-dom';

import SiteDashboard from './SiteDashboard';
import OrganizationsRoutes from './Organizations/OrganizationsRoutes';
import ClientsRoutes from './Clients/ClientsRoutes';
import HospitalsRoutes from './Hospitals/HospitalsRoutes';

function SiteRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<SiteDashboard />} />
      <Route path="clients/*" element={<ClientsRoutes />} />
      <Route path="organizations/*" element={<OrganizationsRoutes />} />
      <Route path="hospitals/*" element={<HospitalsRoutes />} />
      <Route path="" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default SiteRoutes;
