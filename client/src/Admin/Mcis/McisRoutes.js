import { Routes, Route } from 'react-router-dom';

import Mci from './Mci';
import Mcis from './Mcis';
import MciForm from './MciForm';

function McisRoutes() {
  return (
    <Routes>
      <Route path="new" element={<MciForm />} />
      <Route path=":mciId/edit" element={<MciForm />} />
      <Route path=":mciId" element={<Mci />} />
      <Route path="" element={<Mcis />} />
    </Routes>
  );
}

export default McisRoutes;
