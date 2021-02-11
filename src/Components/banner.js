import React from 'react';

const Banner = (props) => {
  return (
    <div className="usa-accordion__heading ">
      <h1 className="font-alt-lg">{props.BannerTitle}</h1>
      <p className="font-alt-md margin-y-neg-1">
        Updated {props.date} @{props.time}
      </p>
    </div>
  );
};

export default Banner;
