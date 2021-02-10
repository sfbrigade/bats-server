import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Accordian from './Accordian';
import './Card.scss';

function Card({ className, header, children, accordianTitle, accordianContent }) {
  const [now, setNow] = useState(DateTime.local());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classNames('usa-card__container height-auto', className)}>
      <header className="usa-card__header">
        <h2>{header}</h2>
      </header>
      <div className="usa-card__body flex-auto">
        <p>{children}</p>
      </div>
      <div className="usa-card__footer">
        <div className="eta-arrival-time">
          ETA: {now.toFormat('hh:mm:ss')} <span>{now.toFormat('a')}</span>
        </div>
        <Accordian title={accordianTitle} content={accordianContent} />
      </div>
    </div>
  );
}
Card.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string.isRequired,
  children: PropTypes.node,
  accordianTitle: PropTypes.node,
  accordianContent: PropTypes.node,
};
Card.defaultProps = {
  className: null,
  children: null,
  accordianTitle: null,
  accordianContent: null,
};
export default Card;
