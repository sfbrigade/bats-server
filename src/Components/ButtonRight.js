import React from 'react';
import PropTypes from 'prop-types';

const ButtonRight = ({ update, ButtonTitle }) => {
  return (
    <div className="grid-row height-7 width-card-full">
      <div className="grid-col-9" />
      <div className="grid-col-3">
        <button type="button" className="usa-button" onClick={update}>
          {ButtonTitle}
        </button>
      </div>
    </div>
  );
};

ButtonRight.propTypes = {
  update: PropTypes.func.isRequired,
  ButtonTitle: PropTypes.string.isRequired,
};

export default ButtonRight;
