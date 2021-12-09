import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ErRingdownsTable from './ErRingdownsTable';

export default function ErRingdowns({ allRingdowns }) {
  const [showMore, setShowMore] = useState(false);

  const More = () => {
    setShowMore(true);
  };

  const Back = () => {
    setShowMore(false);
  };
  console.log("In ErRingDowns", allRingdowns)

  return <div className="margin-left-9 padding-left-2">{showMore === false && <ErRingdownsTable more={More} allRingdowns={allRingdowns} />}</div>;
}
ErRingdowns.propTypes = {
  allRingdowns: PropTypes.array.isRequired
}
ErRingdowns.defaultProps = {
  allRingdowns: null
}
