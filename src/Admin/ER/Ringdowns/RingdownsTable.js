import React, { useContext, useEffect, useState } from 'react';

import ApiService from '../../../ApiService';
import Context from '../../../Context';

function RingdownsTable() {
  const { user } = useContext(Context);
  const [ringdowns, setRingdowns] = useState([]);

  useEffect(() => {
    if (user) {
      ApiService.ringdowns.get(user?.activeHospitals[0].hospital.id).then((response) => {
        setRingdowns(response.data);
      });
    }
  }, [user]);

  return (
    <table className="usa-table usa-table--borderless width-full">
      <thead>
        <tr>
          <th>ETA</th>
          <th>Status</th>
          <th>Ambulance #</th>
          <th>Chief Complaint</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {ringdowns.map((ringdown) => (
          <tr key={ringdown.id}>
            <td>{ringdown.patientDelivery.currentDeliveryStatusDateTimeLocal}</td>
            <td>{ringdown.ambulance.ambulanceIdentifier}</td>
            <td>{ringdown.emsCall.dispatchCallNumber}</td>
            <td>{ringdown.patient.cheifComplaintDescription}</td>
            <td>
              <button type="button" className="bg-white border-0">
                !
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RingdownsTable;
