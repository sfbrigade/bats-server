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
    <table cellSpacing="0" cellPadding="0">
      <tbody>
        <tr>
          <th className="padding-2">ETA</th>
          <th className="padding-2">Status</th>
          <th className="padding-2">Ambulance #</th>
          <th className="padding-2">Chief Complaint</th>
        </tr>
        {ringdowns.map((ringdown) => (
          <tr key={ringdown.id}>
            <td className="padding-2 row-border">{ringdown.patientDelivery.currentDeliveryStatusDateTimeLocal}</td>
            <td className="padding-2 row-border">{ringdown.ambulance.ambulanceIdentifier}</td>
            <td className="padding-2 row-border">{ringdown.emsCall.dispatchCallNumber}</td>
            <td className="padding-2 row-border">{ringdown.patient.cheifComplaintDescription}</td>
            <td className="padding-2 row-border">
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
