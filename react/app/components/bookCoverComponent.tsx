import React, { useState } from "react";
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

const Cover = ({ url, NoCoverComponent, preview = "", style = {}, className = "" }) => {
  if (!url) {
    return <NoCoverComponent />;
  }

  const [loaded, setLoaded] = useState(false);

  if (preview) {
    return (
      <>
        <img alt="Book cover preview" src={preview} style={{ display: !loaded ? "" : "none" }} />
        <img alt="Book cover" {...getCrossOriginAttribute(url)} src={url} onLoad={() => setLoaded(true)} style={{ display: loaded ? "" : "none" }} />
      </>
    );
  } else {
    return <SuspenseImg alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} />;
  }
};

export const CoverMobile = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverMobile} />;

export const CoverSmall = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverSmall} />;

export const CoverMedium = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverMedium} />;
