import React, { useState } from 'react';
import { promiseImpl } from 'ejs';


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

      const BorderRound = {
          "borderRadius": "45%",
          "fontSize": "20px"
      }
      const NumberBox = {
          "border": "1px solid black",
          "borderRadius": "25%",
          "width": "2em",
          "textAlign": "center"
      }

    return (
        <div>
            <div className="grid-container">
  <div className="grid-row">
    <div className="grid-col-8">{props.CountTitle}</div>
    <div className="grid-col-auto"><button className="usa-button" style={BorderRound} onClick={handleDecrement}>-</button></div>
    <div className="grid-col-auto"><div style={NumberBox}>{count}</div></div>
    <div className="grid-col-auto"><button className="usa-button border" style={BorderRound} onClick={handleIncrement}>+</button></div>
  </div>
</div>
            
    </div>
    )
}

export default Counter;