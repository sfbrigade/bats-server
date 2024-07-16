import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../Context';
import ApiService from '../../ApiService';

function Hospitals() {
  const { user, organization } = useContext(Context);
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    console.log('organization', organization);
    if (organization?.id) {
      ApiService.organizations.get(organization.id).then((response) => {
        if (organization?.type === 'HEALTHCARE') {
          setHospitals(response.data.hospitals);
        }
      });
    }
  }, [organization]);

  return (
    <>
      {organization?.type === 'HEALTHCARE' && (
        <main>
          <div className="display-flex flex-align-center flex-justify">
            <h1>Hospitals</h1>
            {user?.isSuperUser && (
              <Link to="new" className="usa-button usa-button--primary">
                Add new Hospital
              </Link>
            )}
          </div>
          <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
            <thead>
              <tr>
                <th className="w-50">Name</th>
                <th>State Facility Code</th>
              </tr>
            </thead>
            <tbody>
              {hospitals?.map((h) => (
                <tr key={h.id} onClick={() => navigate(h.id)}>
                  <td>{h.name}</td>
                  <td>{h.stateFacilityCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </>
  );
}

export default Hospitals;
