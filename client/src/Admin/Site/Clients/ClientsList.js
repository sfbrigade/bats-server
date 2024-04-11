import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import ApiService from '../../../ApiService';

function ClientsList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    ApiService.clients.index().then((response) => setRecords(response.data));
  }, []);

  return (
    <main>
      <div className="display-flex flex-align-center flex-justify">
        <h1>Clients</h1>
        <Link to="new" className="usa-button usa-button--primary">
          Add new Client
        </Link>
      </div>
      <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
        <thead>
          <tr>
            <th className="w-25">Name</th>
            <th className="w-25">Redirect URI</th>
            <th>Service Account User</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} onClick={() => navigate(r.id)}>
              <td>{r.name}</td>
              <td>{r.redirectUri}</td>
              <td>{r.User?.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default ClientsList;
