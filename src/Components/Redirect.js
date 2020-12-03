import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Context from '../Context';

function Redirect() {
  const {user} = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (user.organization.type == 'HEALTHCARE') {
        history.push('/er');
      } else {
        history.push('/ems');
      }
    }
  }, [history, user]);

  return (
    <div>Loading...</div>
  );
}

export default Redirect;
