import React, { useState } from 'react';

import RingdownCard from '../Components/RingdownCard';
import './RingdownSection.scss';

function RingdownSection({ title, ringdowns }) {
  const [isExpanded, setExpanded] = useState(true);

  return ringdowns.length === 0 ? (
    <></>
  ) : (
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
        <div className="ringodwn-section__caret">
          {isExpanded ? (
            <i className="fas fa-caret-up btn" onClick={() => setExpanded(false)} />
          ) : (
            <i className="fas fa-caret-down btn" onClick={() => setExpanded(true)} />
          )}
        </div>
      </div>
      {isExpanded && ringdowns.map((r) => <RingdownCard key={r.id} className="margin-x-3 margin-y-2" ringdown={r} />)}
    </div>
  );
}

export default RingdownSection;
