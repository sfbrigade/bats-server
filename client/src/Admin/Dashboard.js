import { useContext } from 'react';
import { Link } from 'react-router-dom';

import Context from '../Context';

import MciActive from './Mcis/MciActive';
// import UsersTable from './Users/UsersTable';

export default function Dashboard() {
  const { user, organization } = useContext(Context);
  return (
    <main>
      {(user?.isSuperUser || organization?.type === 'C4SF') && (
        <div className="margin-bottom-5">
          <div className="display-flex flex-align-center flex-justify">
            <h1>MCIs</h1>
            <Link to="/admin/mcis/new" className="usa-button usa-button--primary">
              Start new MCI
            </Link>
          </div>
          <MciActive />
        </div>
      )}
      {/* <div>
        <h1>Active Users</h1>
        <UsersTable isActive />
      </div> */}
    </main>
  );
}
