import { Routes, Route } from 'react-router-dom';

import ClientForm from './ClientForm';
import ClientsList from './ClientsList';

function ClientsRoutes() {
  return (
    <Routes>
      <Route path=":clientId" element={<ClientForm />} />
      <Route path="" element={<ClientsList />} />
    </Routes>
  );
}

export default ClientsRoutes;
