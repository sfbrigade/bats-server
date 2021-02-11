import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import Accordian from './Accordian'; 

import './Header.scss';

function CardBody({ header, children, accordianTitle, accordianContent }) {
  const [now, setNow] = useState(DateTime.local());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ul className="usa-card-group">
        <li className="tablet:grid-col-4 usa-card usa-card--header-first">  
            <div className="usa-card__container">
                <header className="usa-card__header">      
                    <h2 className="header__time"> {header} </h2>
                </header>
                <div className="usa-card__body">
                    <p> {children} </p> 
                </div>
                <div class="line"></div>
                <div className="usa-card__footer" >
                  <div className="eta-arrival-time">
                    
                      ETA: 19:59:29
                  </div>
                  <Accordian 
                      title={accordianTitle}
                      content={accordianContent}
                  />
                </div>
            </div> 
        </li>
    </ul>
  );
}
CardBody.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.node,
  accordianTitle: PropTypes.node,
  accordianContent: PropTypes.node
//   time: PropTypes.node,
};
CardBody.defaultProps = {
  children: null,
  accordianTitle: null, 
  accordianContent: null
//   time: "",
};
export default CardBody;