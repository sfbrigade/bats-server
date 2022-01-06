import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ErRingdownsTable from './ErRingdownsTable';

export default function ErRingdowns({ allRingdowns }) {
  const [showMore, setShowMore] = useState(false);

  const More = () => {
    setShowMore(true);
  };

  return (
    <div className="margin-left-9 padding-left-2">{showMore === false && <ErRingdownsTable more={More} allRingdowns={allRingdowns} />}</div>
  );
}
ErRingdowns.propTypes = {
  allRingdowns: PropTypes.shape({
    id: PropTypes.string,
    ambulance: PropTypes.shape({
      ambulanceIdentifier: PropTypes.string,
    }),
    emsCall: PropTypes.shape({
      dispatchCallNumber: PropTypes.number,
    }) ,
    hospital:PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }) ,
    patient: PropTypes.shape({
      age: PropTypes.number,
      sex: PropTypes.string,
      emergencyServiceResponseType: PropTypes.string,
    }) ,
    patientDelivery: PropTypes.shape({
      currentDeliveryStatus: PropTypes.string,
      currentDeliveryStatusDateTimeLocal: PropTypes.string,
      etaMinutes: PropTypes.number,
      timestamps: PropTypes.shape({
        ARRIVED: PropTypes.string,
        "RINGDOWN RECEIVED": PropTypes.string,
        "RINGDOWN SENT": PropTypes.string
      })

    }),
  }).isRequired
};