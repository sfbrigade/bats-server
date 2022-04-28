import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Context from '../Context';
import Spinner from './Spinner';

function Redirect({ isAdminOnly }) {
  const { user } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (!isAdminOnly && user.isOperationalUser) {
        if (user.organization.type === 'HEALTHCARE') {
          history.push('/er');
        } else {
          history.push('/ems');
        }
      } else if (user.isAdminUser) {
        history.push('/admin');
      }
    }
  }, [history, user, isAdminOnly]);

  return (
    <div className="padding-9">
      <Spinner />
    </div>
  );
}

Redirect.propTypes = {
  isAdminOnly: PropTypes.bool,
};

Redirect.defaultProps = {
  isAdminOnly: undefined,
};

export default Redirect;
