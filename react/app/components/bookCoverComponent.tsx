import React from "react";
import { getCrossOriginAttribute } from "util/corsHelpers";

import "./bookCoverComponentStyles.css";
import { SuspenseImg } from "./suspenseImage";

export const NoCoverMobile = () => (
  <div className="no-cover-small">
    <div>No Cover</div>
  </div>
);

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

export const CoverMobile = ({ url }) =>
  url ? <img alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} /> : <NoCoverMobile />;

export const CoverSmall = ({ url }) =>
  url ? <img alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} /> : <NoCoverSmall />;

export const CoverMedium = ({ url }) =>
  url ? <img alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} /> : <NoCoverMedium />;
