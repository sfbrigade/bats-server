import React from 'react';

const ButtonLeft =  (props) => {
    return (
        <div className="grid-row height-7 width-card-full">
            <div class="grid-col-9"></div>
            <div className="grid-col-3">
                <button className="usa-button"> 
                    {props.ButtonTitle} 
                </button>
            </div>
        </div>
    )
}

export default ButtonLeft;