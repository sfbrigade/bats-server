import React, { useState } from 'react';

const DiversionPopupConfirmation = (props) => {

    return (  
        <div className="popup">  
        <div className="PopupInner PopupTwo">  
        <h1>Divert status updated</h1>  
        <p>Ambulances will be notified.</p>
        <button className="usa-button" onClick={props.ok}>Back to form</button> 
        </div>  
        </div>  
        );  

}

export default DiversionPopupConfirmation;