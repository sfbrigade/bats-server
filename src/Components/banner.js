import React from 'react';
import './Banner.scss';

const Banner = (props) => {
  return (
    <div className="usa-accordion__heading ">
      <h1 className="font-alt-lg banner_title">{props.BannerTitle}</h1>
      <p className="font-alt-md margin-y-neg-1 banner_update_info">
        Updated {props.date} @{props.time}
      </p>
    </div>
  );
};

export default Banner;
