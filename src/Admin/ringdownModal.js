import React from 'react';
import PropTypes from 'prop-types';

import './RingdownModal.scss';

export default function RingdownModal({ showModal, handleClose }) {
  const showHideClassName = showModal ? 'ringdown__modal display__block' : 'ringdown__modal display__none';

  return (
    <div className={showHideClassName}>
      <section className="ringdown__modal__main">
        Ringdown Modal
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
}
RingdownModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
