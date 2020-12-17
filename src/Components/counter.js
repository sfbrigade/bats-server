import React, { useState } from 'react';

const Counter = (props) => {

    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount((prevCount) => prevCount + 1);
        props.update()
      };
    
      const handleDecrement = () => {
        setCount((prevCount) => prevCount - 1);
        props.update()
      };

   

    return (
        <div className="container">
            <div className="grid-container">
  <div className="grid-row">
    <div className="grid-col-7 title">{props.CountTitle}</div>
    <div className="grid-col-auto"><button className="usa-button circle-105 margin-05" onClick={handleDecrement}><span className="font-alt-lg position-absolute bottom-05 left-2">-</span></button></div>
    <div className="grid-col-auto NumberBox"><div className="position-absolute bottom-05 left-2">{count}</div></div>
    <div className="grid-col-auto"><button className="usa-button circle-2 margin-05" onClick={handleIncrement}><span className="font-alt-lg position-absolute bottom-05 left-2">+</span></button></div>
  </div>
</div>
            
    </div>
    )
}

export default Counter;