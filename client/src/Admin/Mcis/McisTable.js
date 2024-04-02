import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ApiService from '../../ApiService';
import Context from '../../Context';

function McisTable({ isActive }) {
  const { mci, organization, hospital } = useContext(Context);
  const [mcis, setMcis] = useState([]);

  useEffect(() => {
    if (mci && organization) {
      const params = { organizationId: organization?.id, hospitalId: hospital?.id };
      let request;
      if (isActive) {
        request = ApiService.mcis.active(params);
      } else {
        request = ApiService.mcis.index(params);
      }
      request.then((response) => {
        setMcis(response.data);
      });
    }
  }, [mci, organization, hospital, isActive]);

  return (
    <table className="usa-table usa-table--borderless width-full">
      <thead>
        <tr>
          <th>Incident #</th>
          <th>Address</th>
          <th>Started at</th>
          <th>Ended at</th>
        </tr>
      </thead>
      <tbody>
        {mcis.map((u) => (
          <tr key={u.id}>
            <td>{u.firstName}</td>
            <td>{u.lastName}</td>
            <td>{u.email}</td>
            <td>
              <Link to={`/admin/mcis/${u.id}`}>More &gt;</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

McisTable.propTypes = {
  isActive: PropTypes.bool,
};

McisTable.defaultProps = {
  isActive: undefined,
};

export default McisTable;
