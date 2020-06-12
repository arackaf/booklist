import React from "react";
import { getCrossOriginAttribute } from "util/corsHelpers";

import "./bookCoverComponentStyles.css";
import { SuspenseImg } from "./suspenseImage";

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

export const CoverSmall = ({ url }) => (url ? <SuspenseImg {...getCrossOriginAttribute(url)} src={url} /> : <NoCoverSmall />);

export const CoverMedium = ({ url }) => (url ? <SuspenseImg {...getCrossOriginAttribute(url)} src={url} /> : <NoCoverMedium />);
