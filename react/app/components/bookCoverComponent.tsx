import React, { useState, useRef, useEffect } from "react";
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
  const initialUrl = useRef(url || "");
  const urlChanged = url !== initialUrl.current;
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return <NoCoverComponent />;
  }

  if (preview) {
    return (
      <>
        <img alt="Book cover preview" src={preview} style={{ display: !loaded ? "block" : "none" }} />
        <img
          alt="Book cover"
          {...getCrossOriginAttribute(url)}
          src={url}
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? "block" : "none" }}
        />
      </>
    );
  } else {
    return urlChanged ? (
      <img alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} />
    ) : (
      <SuspenseImg alt="Book cover" {...getCrossOriginAttribute(url)} style={{ display: "block" }} src={url} />
    );
  }
};

export const CoverMobile = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverMobile} />;

export const CoverSmall = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverSmall} />;

export const CoverMedium = ({ url, preview = "" }) => <Cover url={url} preview={preview} NoCoverComponent={NoCoverMedium} />;
