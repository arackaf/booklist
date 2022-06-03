import React from "react";
import { WcWrapper } from "util/WcWrapper";

import "./bookCoverComponentStyles.css";

import "uikit/book-cover";
import "uikit/no-book-cover";

const Cover = ({ url, noCoverComponent = "", preview = "" }) => {
  return <WcWrapper wcTag="uikit-cover" url={url} preview={preview} nocover={noCoverComponent} />;
};

export const CoverMobile = ({ url, preview = "", dontSuspend = false }) => (
  <Cover url={url} preview={preview} noCoverComponent="uikit-no-cover-mobile" />
);

export const CoverSmall = ({ url, preview = "", dontSuspend = false }) => (
  <Cover url={url} preview={preview} noCoverComponent="uikit-no-cover-small" />
);

export const CoverMedium = ({ url, preview = "", dontSuspend = false }) => (
  <Cover url={url} preview={preview} noCoverComponent="uikit-no-cover-medium" />
);
