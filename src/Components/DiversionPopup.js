import React, { useState } from 'react';

const DiversionPopup = (props) => {
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
        "background": "#fee685"  

    }

    return (  
        <div style={popup}>  
        <div style={PopupInner}>  
        <h1>Change divert status?</h1>  
        <button className="usa-button--outline" onClick={props.keep}>Keep status</button> <button className="usa-button--secondary" onClick={props.update}>Update status</button>
        </div>  
        </div>  
        );  

}

export default DiversionPopup;