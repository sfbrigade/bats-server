import { Routes, Route } from 'react-router-dom';

import HospitalForm from './HospitalForm';
import HospitalsList from './HospitalsList';

function OrganizationsRoutes() {
  return (
    <Routes>
      <Route path=":hospitalId" element={<HospitalForm />} />
      <Route path="" element={<HospitalsList />} />
    </Routes>
  );
}

export default OrganizationsRoutes;
