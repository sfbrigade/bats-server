import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Context from '../Context';

function Redirect({ isAdminOnly }) {
  const { user } = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      if (!isAdminOnly && user.isOperationalUser) {
        if (user.organization.type === 'HEALTHCARE') {
          history.push('/er');
        } else if (user.organization.type === 'C4SF') {
          history.push('/admin');
        } else {
          history.push('/ems');
        }
      } else if (user.isAdminUser) {
        history.push('/admin');
      }
    }
  }, [history, user, isAdminOnly]);

  return null;
}

Redirect.propTypes = {
  isAdminOnly: PropTypes.bool,
};

Redirect.defaultProps = {
  isAdminOnly: undefined,
};

export default Redirect;
