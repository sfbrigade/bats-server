import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';

import ApiService from '../ApiService';

function Venues() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    ApiService.organizations.index({ type: 'VENUE', include: 'Hospital' }).then((response) => {
      setOrgs(response.data);
    });
  }, []);

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <Header name="Routed" />
          <div>
            <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
              <tbody>
                {orgs.map((org) => (
                  <Fragment key={org.id}>
                    <tr>
                      <td>
                        <h3>{org.name}</h3>
                      </td>
                      <td>
                        <Link className="usa-button width-full" to={`/ems?venueId=${org.id}`}>
                          EMS
                        </Link>
                      </td>
                    </tr>
                    {org.hospitals.map((hospital) => (
                      <tr key={hospital.id}>
                        <td>
                          <h3 className="padding-left-5">{hospital.name}</h3>
                        </td>
                        <td>
                          <Link className="usa-button width-full" to={`/er?hospitalId=${hospital.id}`}>
                            Clinic
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Venues;
