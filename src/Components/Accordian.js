import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './Accordian.css';

function Accordion(props) {
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');
  const [setAriaExpanded, setExpandedState] = useState('false');

  const content = useRef(null);
  // const { content: { body } = {} } = props;
  // body['id'] = useRef(null);
  const { title } = props;
  // const sanitizer = dompurify.sanitize;

  function toggleAccordion() {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : `${content.current.scrollHeight}px`);
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
      <div ref={content} style={{ maxHeight: `${setHeight}` }} className="accordian-content">
        <div className="accordian-text" dangerouslySetInnerHTML={{ __html: props.content }} />
      </div>
    </div>
  );
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Accordion;
