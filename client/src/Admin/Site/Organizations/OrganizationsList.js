import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import ApiService from '../../../ApiService';

function OrganizationsList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    ApiService.organizations.index().then((response) => setRecords(response.data));
  }, []);

  return (
    <main>
      <div className="display-flex flex-align-center flex-justify">
        <h1>Organizations</h1>
        <Link to="new" className="usa-button usa-button--primary">
          Add new Organization
        </Link>
      </div>
      <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
        <thead>
          <tr>
            <th className="w-50">Name</th>
            <th className="w-25">Type</th>
            <th>State Unique ID</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} onClick={() => navigate(r.id)}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.stateUniqueId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default OrganizationsList;
