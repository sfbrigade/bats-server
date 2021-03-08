import React from 'react';
import './Banner.scss';
import PropTypes from 'prop-types';

const Banner = ({ date, time, BannerTitle }) => {
  return (
    <div className="usa-accordion__heading ">
      <h1 className="font-alt-lg banner_title">{BannerTitle}</h1>
      <p className="font-alt-md margin-y-neg-1 banner_update_info">
        Updated {date} @{time}
      </p>
    </div>
  );
};

Banner.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  BannerTitle: PropTypes.string.isRequired,
};

export default Banner;
