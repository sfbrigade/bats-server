import React from 'react';
import PropTypes from 'prop-types';

// it is possible this component can go into the component folder.
const AdminNavLink = React.forwardRef(({ click, title, isCurrent }, ref) => {
  return (
      <a ref={ref} onClick={() => click(title)} className={isCurrent ? 'text-primary' : 'text-base-light'}>
        {title}
      </a>
  
  );
})
AdminNavLink.propTypes = {
  click: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
};

export default AdminNavLink;