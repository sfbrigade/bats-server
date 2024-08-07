import { Routes, Route } from 'react-router-dom';

import HospitalsList from './HospitalsList';

function HospitalsRoutes() {
  return (
    <Routes>
      <Route path="" element={<HospitalsList />} />
    </Routes>
  );
}

export default HospitalsRoutes;
