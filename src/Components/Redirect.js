import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Context from '../Context';
import Spinner from './Spinner';

function Redirect() {
  const { user } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (user.organization.type === 'HEALTHCARE') {
        history.push('/er');
      } else {
        history.push('/ems');
      }
    }
  }, [history, user]);

  return (
    <div className="padding-9">
      <Spinner />
    </div>
  );
}

export default Redirect;
