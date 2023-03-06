import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import RingdownCard from '../Components/RingdownCard';

import './RingdownSection.scss';
import ERContext from './ERContext';

function RingdownSection({ title, ringdowns, onStatusChange, id }) {
  const { ringdownSections, setRingdownSections } = useContext(ERContext);
  const isExpanded = ringdownSections && ringdownSections[id].expanded;

  const handleExpanded = () => {
    setRingdownSections({
      ...ringdownSections,
      [id]: {
        ...ringdownSections[id],
        expanded: !ringdownSections[id].expanded,
      },
    });
  };
  return (
    <div className="ringdown-section">
      <div
        className="usa-accordion__heading ringdown-section__header"
        onClick={handleExpanded}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleExpanded();
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
