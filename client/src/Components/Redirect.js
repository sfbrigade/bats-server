import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Context from '../Context';
import Spinner from './Spinner';

function Redirect() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.isSuperUser) {
        navigate('/admin/site');
      } else if (user.isOperationalUser) {
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
    } else if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);
  return <Spinner />;
}

Redirect.propTypes = {};

Redirect.defaultProps = {};

export default Redirect;
