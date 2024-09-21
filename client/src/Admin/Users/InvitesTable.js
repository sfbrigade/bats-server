import React, { useContext, useEffect, useState } from 'react';

import ApiService from '../../ApiService';
import Spinner from '../../Components/Spinner';
import Context from '../../Context';

function InvitesTable() {
  const { user, organization } = useContext(Context);
  const [invites, setInvites] = useState();

  useEffect(() => {
    if (user && organization) {
      const params = { organizationId: organization?.id };
      ApiService.invites.index(params).then((response) => {
        setInvites(response.data);
      });
    }
  }, [user, organization]);

  return (
    <table className="usa-table usa-table--striped usa-table--hoverable usa-table--borderless width-full">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {invites?.map((i) => (
          <tr key={i.id}>
            <td>{i.firstName}</td>
            <td>{i.lastName}</td>
            <td>{i.email}</td>
            <td></td>
          </tr>
        ))}
        {invites?.length === 0 && (
          <tr>
            <td colSpan={4}>No invites yet.</td>
          </tr>
        )}
        {!invites && (
          <tr>
            <td colSpan={4}>
              <Spinner size="sm" />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default InvitesTable;
