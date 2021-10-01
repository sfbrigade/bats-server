import React, { useState } from 'react';

import ErRingdownsTable from './ErRingdownsTable';

export default function ErRingdowns() {
  const [showMore, setShowMore] = useState(false);

  const More = () => {
    setShowMore(true);
  };

  const Back = () => {
    setShowMore(false);
  };

  return <div className="margin-left-9 padding-left-2">{showMore === false && <ErRingdownsTable more={More} />}</div>;
}
