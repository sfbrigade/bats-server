import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import RingdownCard from '../Components/RingdownCard';

import './RingdownSection.scss';

function RingdownSection({ title, ringdowns, onStatusChange }) {
  const [isExpanded, setExpanded] = useState(true);

  return (
    <div className="ringdown-section">
      <div
        className="usa-accordion__heading ringdown-section__header"
        onClick={() => setExpanded(!isExpanded)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setExpanded(!isExpanded);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="ringdown-section__title">
          {title}
          <div className="ringdown-section__badge">{ringdowns.length}</div>
        </div>
        <div className="ringdown-section__caret">
          {isExpanded ? <i className="fas fa-caret-up btn" /> : <i className="fas fa-caret-down btn" />}
        </div>
      </div>
      {isExpanded &&
        ringdowns.map((r) => <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} onStatusChange={onStatusChange} />)}
    </div>
  );
}

RingdownSection.propTypes = {
  title: PropTypes.node.isRequired,
  ringdowns: PropTypes.arrayOf(PropTypes.instanceOf(Ringdown)).isRequired,
  onStatusChange: PropTypes.instanceOf(Function).isRequired,
};

export default RingdownSection;
