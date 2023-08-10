import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import RingdownCard from '../Components/RingdownCard';
import Context from '../Context';

import './RingdownSection.scss';

function RingdownSection({ title, ringdowns, onStatusChange }) {
  const { ringdownSection, setRingdownSection } = useContext(Context);

  const isMinimized = ringdownSection[title] || false;
  const handleExpand = () => {
    setRingdownSection({
      ...ringdownSection,
      [title]: !isMinimized,
    });
  };

  return (
    <div className="ringdown-section">
      <div
        className="usa-accordion__heading ringdown-section__header"
        onClick={handleExpand}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleExpand();
        }}
        role="button"
        tabIndex={0}
      >
        <div className="ringdown-section__title">
          {title}
          <div className="ringdown-section__badge">{ringdowns.length}</div>
        </div>
        <div className="ringdown-section__caret">
          {!isMinimized ? <i className="fas fa-caret-up btn" /> : <i className="fas fa-caret-down btn" />}
        </div>
      </div>
      {!isMinimized &&
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
