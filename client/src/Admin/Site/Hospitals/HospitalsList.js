import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import ApiService from '../../../ApiService';

function HospitalsList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    ApiService.hospitals.index().then((response) => setRecords(response.data));
  }, []);

  async function onDrop(records) {
    let i = 1;
    for (const record of records) {
      record.sortSequenceNumber = i++;
    }
    setRecords(records);
    try {
      await ApiService.hospitals.sort(records.map((r) => ({ id: r.id, sortSequenceNumber: r.sortSequenceNumber })));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main>
      <div className="display-flex flex-align-center flex-justify">
        <h1>Hospitals</h1>
      </div>
      <table className="usa-table usa-table--striped usa-table--borderless width-full">
        <thead>
          <tr>
            <th></th>
            <th className="w-35">Name</th>
            <th className="w-35">Organization</th>
            <th>State Facility Code</th>
          </tr>
        </thead>
        <ReactSortable tag="tbody" list={records} setList={(list) => onDrop(list)}>
          {records.map((r) => (
            <tr key={r.id}>
              <td className="cursor--grab">&equiv;</td>
              <td>{r.name}</td>
              <td>{r.organization?.name}</td>
              <td>{r.stateFacilityCode}</td>
            </tr>
          ))}
        </ReactSortable>
      </table>
    </main>
  );
}

export default HospitalsList;
