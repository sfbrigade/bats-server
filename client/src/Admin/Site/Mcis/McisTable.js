import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';

import ApiService from '../../../ApiService';

function McisTable() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    ApiService.mcis.index().then((response) => setRecords(response.data));
  }, []);

  return (
    <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
      <thead>
        <tr>
          <th className="w-20">Incident #</th>
          <th className="w-30">Address</th>
          <th className="w-25">Started</th>
          <th className="w-25">Ended</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id} onClick={() => navigate(r.id)}>
            <td>{r.incidentNumber}</td>
            <td>
              {r.address1} {r.address2}
            </td>
            <td>{DateTime.fromISO(r.startedAt).toLocaleString(DateTime.DATETIME_FULL)}</td>
            <td>{r.endedAt && DateTime.fromISO(r.endedAt).toLocaleString(DateTime.DATETIME_FULL)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default McisTable;
