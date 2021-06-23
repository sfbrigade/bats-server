import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';


export default function ComboBox({ label, property, required, value, onChange }){
 
    const ambtempdata = [
        "1234",
        "3435",
        "1325",
        "1643",
        "4563",
        "2543",
        "2314",
        "3452",
        "3612",
        "3214",
        "5678"
      ];

      const distempdata = [
        "6734",
        "5435",
        "3225",
        "1643",
        "4563",
        "6743",
        "2314",
        "3642",
        "3782",
        "3214",
        "3278"
      ];

      const options = [<option></option>]
      
      if (property === "ambulanceIdentifier"){
        let ambId = fetch('/identifiers');
        console.log("api", ambId);
        for (let i = 0; i < ambtempdata.length; i += 1){
            options.push(<option key={ambtempdata[i]} value={value}>{ambtempdata[i]}</option>)
        }
    } else if (property === "dispatchCallNumber"){ 
        let unitIds = fetch('/dispatch-call-numbers');
        console.log("api2", unitIds);
        for (let i = 0; i < distempdata.length; i += 1){
          options.push(<option key={distempdata[i]} value={value}>{distempdata[i]}</option>)
      }
    }
   
    
     
    return (
        <>
        <label className='usa-label' htmlFor={property}>{label}</label>
        <div className="usa-combo-box">

          <select
            className="usa-select usa-input--medium"
            name={property}
            id={property}
            required={required}
            data-number-filter="[0-9]"
            data-filter="{{numberFilter}}.*"
            onChange={onChange}
            > 
            
            {options}
            
            </select> 

        </div>
        </>
    )
}

ComboBox.propTypes = {
    // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    // disabled: PropTypes.bool,
    // isWrapped: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    property: PropTypes.string.isRequired,
    required: PropTypes.bool,
    // showRequiredHint: PropTypes.bool,
    // size: PropTypes.oneOf(['small', 'medium']),
    // type: PropTypes.oneOf(['number', 'text']),
    // unit: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };