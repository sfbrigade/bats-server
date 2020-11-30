import React, { useState } from 'react';

const DiversionPopupConfirmation = (props) => {
    const popup = {
        "position": "fixed",  
        "width": "100%",  
        "height": "100%",  
        "top": "0",  
        "left": "0",  
        "right": "0",  
        "bottom": "0",  
        "margin": "auto",  
        
    }

    const PopupInner ={
        "position": "absolute",  
        "left": "25%",
        "right": "25%",  
        "top": "25%",
        "bottom": "25%",  
        "margin": "auto",  
        "background": "#ecf3ec"  

    }

    return (  
        <div style={popup}>  
        <div style={PopupInner}>  
        <h1>Divert status updated</h1>  
        <p>Ambulances will be notified.</p>
        <button className="usa-button" onClick={props.ok}>Back to form</button> 
        </div>  
        </div>  
        );  

}

export default DiversionPopupConfirmation;