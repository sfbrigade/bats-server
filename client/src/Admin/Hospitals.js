import React, { useContext, useState, useEffect } from 'react';
import Context from '../Context';
import ApiService from '../ApiService';

function Hospitals() {
  const { organization } = useContext(Context);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    ApiService.organizations.get(organization.id).then((response) => {
      if (organization?.type === 'HEALTHCARE') {
        setHospitals(response.data.hospitals);
      }
    });
  }, [organization]);

  return (
    <>
      {organization.type === 'HEALTHCARE' && (
        <main>
          <div>
            <h1>Hospitals</h1>
            {hospitals.map((hospital) => (
              <div>{hospital.name}</div>
            ))}
          </div>
        </main>
      )}
    </>
  );
}

export default Hospitals;
