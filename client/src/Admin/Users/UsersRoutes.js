import { Routes, Route } from 'react-router-dom';

import UserForm from './UserInfo';
import UsersList from './Users';

function UsersRoutes() {
  return (
    <Routes>
      <Route path=":userId" element={<UserForm />} />
      <Route path="" element={<UsersList />} />
    </Routes>
  );
}

export default UsersRoutes;
