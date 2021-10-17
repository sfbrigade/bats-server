import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Context from '../Context';
import Spinner from './Spinner';

function Redirect() {
  const { user, setHospital } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (user.isAdminUser) {
        if (user.organization.type === 'HEALTHCARE') {
          history.push('/admin/er');
        } else {
          history.push('/admin/ems');
        }
      } else {
        if (user.organization.type === 'HEALTHCARE') {
          history.push('/er');
        } else {
          history.push('/ems');
        }
      }
    }
  }, [history, user, setHospital]);

  return (
    <div className="padding-9">
      <Spinner />
    </div>
  );
}

export default Redirect;
