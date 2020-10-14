import React, { useState } from 'react';
import '../../css/App.css';
import '../../css/nav.css';
import Beds from './beds';
import RingDown from './ringDown.js';
// import Tabs from '../../components/Tabs.js';
import NavBar from './NavBar.js';

const tabs = { 
    'beds': <Beds />,
    'ringDown': <RingDown />
}

export default function ER () {

    const [selectedTab, setSelectedTab] = useState('beds');
  
    return(
      <div>
        <NavBar 
          setSelectedTab={setSelectedTab}
        />
        {/* this is the main content of the page */}
        {tabs[selectedTab]}
      </div>
    )
}

// export default ER;