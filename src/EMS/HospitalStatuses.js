import React, { useEffect, useState } from 'react';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatus from '../Models/HospitalStatus';
import ApiService from '../ApiService';

const HospitalStatuses = () => {
  const [hospitalStatusResponse, setHospitalStatusResponse] = useState([]);

  useEffect(() => {
    ApiService.getHospitalStatuses().then((response) => {
      setHospitalStatusResponse(response.data);
    });
  }, []);

  return (
    <div>
      <div>
        {/* TODO - column header */}
      </div>
      {
        hospitalStatusResponse.map(hsData => {
          const hs = new HospitalStatus(hsData);
          return (
            <HospitalStatusRow
              key={hs.id}
              hospitalStatus={hs} />
          )
        })
      }
      <button className="usa-button width-full margin-top-4" type="button">
        Return to ringdown form
      </button>
    </div>
  );
};


export default HospitalStatuses;
