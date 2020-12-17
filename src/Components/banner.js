import React from "react";

const Banner = (props) => {


    return (
        <section>
        <h1 className="title">{props.BannerTitle}</h1>
        <p className="update">Updated {props.date} @{props.time}</p>
  
        </section>
    )
}

export default Banner;