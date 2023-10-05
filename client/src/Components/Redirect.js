import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Context from '../Context';

function Redirect() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.isOperationalUser) {
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
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null;
}

Redirect.propTypes = {};

Redirect.defaultProps = {};

export default Redirect;
