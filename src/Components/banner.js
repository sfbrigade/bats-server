import React from "react";

const Banner = (props) => {
    const update = {
        "color": "gray",
        "fontSize": "20px",
        "margin": "0em"
    }
    const title = {
        "margin":"0em"
    }
    
    return (
        <section className="usa-banner">
        <h1 style={title}>{props.BannerTitle}</h1>
        {/* Functionality needed for updated date and time */}
        <p style={update}>Updated {props.date} @{props.time}</p>
  
        </section>
    )
}

export default Banner;