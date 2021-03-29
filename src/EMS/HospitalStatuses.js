import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Context from '../Context';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatusHeader from './HospitalStatusHeader';

const HospitalStatuses = ({ className, onReturn }) => {
  const { statusUpdates } = useContext(Context);

  return (
    <div className={className}>
      <HospitalStatusHeader />
      <div className="grid-container">
        {statusUpdates?.map((hs) => {
          return <HospitalStatusRow key={hs.id} hospitalStatus={hs} />;
        })}
      </div>
      <fieldset className="usa-fieldset">
        <button className="usa-button width-full" type="button" onClick={() => onReturn()}>
          Return to ringdown form
        </button>
      </fieldset>
    </div>
  );
};

HospitalStatuses.propTypes = {
  className: PropTypes.string,
  onReturn: PropTypes.func.isRequired,
};

HospitalStatuses.defaultProps = {
  className: null,
};

export default HospitalStatuses;
