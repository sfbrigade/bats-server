import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Context from '../Context';

function Redirect({ isAdminOnly }) {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!isAdminOnly && user.isOperationalUser) {
        if (user.organization.type === 'HEALTHCARE') {
          navigate('/er');
        } else if (user.organization.type === 'C4SF') {
          navigate('/admin');
        } else {
          navigate('/ems');
        }
      } else if (user.isAdminUser) {
        navigate('/admin');
      }
    }
  }, [user, isAdminOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

Redirect.propTypes = {
  isAdminOnly: PropTypes.bool,
};

Redirect.defaultProps = {
  isAdminOnly: undefined,
};

export default Redirect;
