import React from 'react';
import { Link } from 'react-router-dom';

import McisTable from './McisTable';

function Mcis() {
  return (
    <main>
      <div className="display-flex flex-align-center flex-justify">
        <h1>MCIs</h1>
        <Link to="new" className="usa-button usa-button--primary">
          Start new MCI
        </Link>
      </div>
      <McisTable />
    </main>
  );
}

export default Mcis;
