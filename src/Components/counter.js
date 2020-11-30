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

      const container = {
          "margin": "0.7em",
          "padding": "0.7em"
      }
      const title = {
          "fontSize": "20px"
      }
      const BorderRoundMinus = {
          "borderRadius": "45%",
          "fontSize": "27px",
          "padding": "10%",
          "margin": "-14% 0% 0% -42%",
          "height": "1.2em",
          "width": "1.05em"

          
      }
      const BorderRoundPlus = {
        "borderRadius": "45%",
        "fontSize": "27px",
        "padding": "10%",
        "margin": "-26% 0% 0% 43%",
        "height": "1.6em",
        "width": "1.5em"
        
    }
      const NumberBox = {
          "border": "0.5px solid black",
          "borderRadius": "11%",
          "width": "2em",
          "height": "1.3em",
          "textAlign": "center",
          "paddingTop": "4%",
          "fontSize": "30px",
          "margin": "-9% 0% 0% 0%",
      }

      const ButtonText = {
        "postion": "relative",
        "top": "1em",
        "left": "1em"
      }

    return (
        <div style={container}>
            <div className="grid-container">
  <div className="grid-row">
    <div className="grid-col-8" style={title}>{props.CountTitle}</div>
    <div className="grid-col-auto"><button className="usa-button" style={BorderRoundMinus} onClick={handleDecrement}>-</button></div>
    <div className="grid-col-auto"><div style={NumberBox}>{count}</div></div>
    <div className="grid-col-auto"><button className="usa-button border" style={BorderRoundPlus} onClick={handleIncrement}><span style={ButtonText}>+</span></button></div>
  </div>
</div>
            
    </div>
    )
}

export default Counter;