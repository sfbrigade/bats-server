import { Routes, Route } from 'react-router-dom';

import UserForm from './UserForm';
import UsersList from './UsersList';

function UsersRoutes() {
  return (
    <Routes>
      <Route path=":userId" element={<UserForm />} />
      <Route path="" element={<UsersList />} />
    </Routes>
  );
}

export default UsersRoutes;
