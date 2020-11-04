import React from 'react';
import BedInfo from './BedInfo';

const Beds = () => (
  <div className="bedContent">
    <h1 className="title">Hospital beds + rigs</h1>
    <h3>SF General</h3>
    {/* BedInfo Component will take props containing bed info to be displayed */}
    <BedInfo />
    <h3>CPMC Mission Bernal</h3>
    <BedInfo />
    <h3>CPMC Davies</h3>
    <BedInfo />
    <h3>CPMC Van Ness</h3>
    <BedInfo />
    <h3>St Francis</h3>
    <BedInfo />
    <h3>Chinese Hospital</h3>
    <BedInfo />
    <h3>Kaiser</h3>
    <BedInfo />
    <h3>St Mary&apos;s</h3>
    <BedInfo />
    <h3>UCSF Parnassus</h3>
    <BedInfo />
    <h3>VA Medical Center</h3>
    <BedInfo />
  </div>
);

export default Beds;
