import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import HospitalStatusRow from './HospitalStatusRow';
import HospitalStatusHeader from './HospitalStatusHeader';
import HospitalStatus from '../Models/HospitalStatus';
import ApiService from '../ApiService';

const HospitalStatuses = ({ onReturn }) => {
  const [hospitalStatusResponse, setHospitalStatusResponse] = useState([]);

  useEffect(() => {
    ApiService.hospitalStatuses.get().then((response) => {
      setHospitalStatusResponse(response.data);
    });
  }, []);

  return (
    <div>
      <HospitalStatusHeader />
      {hospitalStatusResponse.map((hsData) => {
        const hs = new HospitalStatus(hsData);
        return <HospitalStatusRow key={hs.id} hospitalStatus={hs} />;
      })}
      <button className="usa-button width-full margin-top-4" type="button" onClick={() => onReturn()}>
        Return to ringdown form
      </button>
    </div>
  );
};

HospitalStatuses.propTypes = {
  onReturn: PropTypes.func.isRequired,
};

export default HospitalStatuses;
