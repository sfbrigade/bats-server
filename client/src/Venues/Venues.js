import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';

import ApiService from '../ApiService';

function Venues() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    ApiService.organizations.index({ type: 'VENUE' }).then((response) => {
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
                  <tr key={org.id}>
                    <td>
                      <h3>{org.name}</h3>
                    </td>
                    <td>
                      <Link className="usa-button" to={`/ems?venueId=${org.id}`}>
                        EMS
                      </Link>
                    </td>
                  </tr>
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
