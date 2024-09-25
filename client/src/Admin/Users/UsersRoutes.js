import { Routes, Route } from 'react-router-dom';

import InviteForm from './InviteForm';
import UserForm from './UserForm';
import UsersList from './UsersList';

function UsersRoutes() {
  return (
    <Routes>
      <Route path="invite" element={<InviteForm />} />
      <Route path=":userId" element={<UserForm />} />
      <Route path="" element={<UsersList />} />
    </Routes>
  );
}

export default UsersRoutes;
