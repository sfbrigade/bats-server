import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './Accordian.css';

function Accordion({ title, content }) {
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');
  const [setAriaExpanded, setExpandedState] = useState('false');

  const contentRef = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : `${contentRef.current.scrollHeight}px`);
    setExpandedState(setActive === 'active' ? 'false' : 'true');
  }

  return (
    <div className="accordian-section">
      <button
        type="button"
        className={`usa-accordion__button ${setActive}`}
        onClick={toggleAccordion}
        aria-expanded={setAriaExpanded}
        aria-controls="a1"
      >
        <p className="accordian-title"> {title} </p>
      </button>
      <div ref={contentRef} style={{ maxHeight: `${setHeight}` }} className="accordian-content">
        <div className="accordian-text" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Accordion;
