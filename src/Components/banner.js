import React from "react";

const Banner = (props) => {
    return (
        <section className="usa-banner">
        <h1>{props.BannerTitle}</h1>
        {/* Functionality needed for updated date and time */}
        <h3>Updated 10/06/20 @19:14</h3>
  
        </section>
    )
}

export default Banner;