import React, { useEffect, useState } from 'react';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatusHeader from './HospitalStatusHeader'; 
import HospitalStatus from '../Models/HospitalStatus';
import ApiService from '../ApiService';

const HospitalStatuses = () => {
  const [hospitalStatusResponse, setHospitalStatusResponse] = useState([]);

  useEffect(() => {
    ApiService.hospitalStatuses.get().then((response) => {
      setHospitalStatusResponse(response.data);
    });
  }, []);

  return (
    <div>
      <HospitalStatusHeader />
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
