import React from 'react';
import PropTypes from 'prop-types';
import HospitalStatus from '../Models/HospitalStatus'

const HospitalStatusRow = ({ hospitalStatus }) => (
  <div>
    <h3>{hospitalStatus.hospitalName}</h3>
    <p>
      On diversion&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>NO</strong>
    </p>
    <p>
      ER beds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>4</strong>&nbsp;&nbsp;&nbsp;&nbsp;15:24 7/20/2020
    </p>
    <p>
      PES beds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>2</strong>&nbsp;&nbsp;&nbsp;&nbsp; 15:24 7/20/2020
    </p>
    <br />
    <p>
      Rigs enroute&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>3</strong>
    </p>
    <p>
      Rigs waiting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <strong>2</strong>
    </p>
    <br />
  </div>
);

HospitalStatusRow.propTypes = {
  hospitalStatus: PropTypes.instanceOf(HospitalStatus).isRequired,
};

export default HospitalStatusRow;
