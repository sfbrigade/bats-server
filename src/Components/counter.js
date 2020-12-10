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
    <div className="grid-col-8 title" >{props.CountTitle}</div>
    <div className="grid-col-auto"><button className="usa-button BorderRoundMinus" onClick={handleDecrement}>-</button></div>
    <div className="grid-col-auto NumberBox"><div >{count}</div></div>
    <div className="grid-col-auto"><button className="usa-button border BorderRoundPlus" onClick={handleIncrement}><span >+</span></button></div>
  </div>
</div>
            
    </div>
    )
}

export default Counter;