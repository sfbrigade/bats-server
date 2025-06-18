import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Context from '../Context';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatusHeader from './HospitalStatusHeader';

const HospitalStatuses = ({ className, onReturn }) => {
  const { statusUpdates } = useContext(Context);

  const venueClinics = statusUpdates?.filter((hs) => hs.hospital.organization.type === 'VENUE');
  const hospitals = statusUpdates?.filter((hs) => hs.hospital.organization.type !== 'VENUE');

  return (
    <div className={className}>
      {venueClinics?.length > 0 && (
        <>
          <HospitalStatusHeader isVenue />
          <div className="grid-container">
            {venueClinics.map((hs) => {
              return <HospitalStatusRow key={hs.id} hospitalStatus={hs} />;
            })}
          </div>
        </>
      )}
      <HospitalStatusHeader />
      <div className="grid-container">
        {hospitals?.map((hs) => {
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
