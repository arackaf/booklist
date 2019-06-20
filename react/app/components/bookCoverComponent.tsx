import React from "react";
import { getCrossOriginAttribute } from "util/corsHelpers";

import "./bookCoverComponentStyles.css";

export const NoCoverSmall = () => (
  <div className="no-cover-small">
    <div>No Cover</div>
  </div>
);

export const NoCoverMedium = () => (
  <div className="no-cover-medium">
    <div>No Cover</div>
  </div>
);

export const CoverSmall = ({ url }) => (url ? <img src={url} {...getCrossOriginAttribute(url)} /> : <NoCoverSmall />);

export const CoverMedium = ({ url }) => (url ? <img src={url} {...getCrossOriginAttribute(url)} /> : <NoCoverMedium />);
