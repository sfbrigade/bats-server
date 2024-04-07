import { Routes, Route } from 'react-router-dom';

import OrganizationForm from './OrganizationForm';
import OrganizationsList from './OrganizationsList';

function OrganizationsRoutes() {
  return (
    <Routes>
      <Route path=":id" element={<OrganizationForm />} />
      <Route path="" element={<OrganizationsList />} />
    </Routes>
  );
}

export default OrganizationsRoutes;
