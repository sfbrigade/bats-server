import React from "react";

const Banner = (props) => {
    return (
        <section className="usa-banner">
        <h1>{props.BannerTitle}</h1>
        {/* Functionality needed for updated date and time */}
        <h3>Updated {props.date} @{props.time}</h3>
  
        </section>
    )
}

export default Banner;