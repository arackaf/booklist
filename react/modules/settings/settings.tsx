import React, { useContext, useState } from "react";
import classNames from "classnames";

import PublicUserSettings from "./components/publicUserSettings/main";
import PasswordReset from "./components/passwordReset/main";
import ThemeChooser from "./components/themeChooser/main";
import localStorageManager from "util/localStorage";
import { AppContext } from "app/renderUI";

const TabContent = ({ currentTab }) => {
  const [{ isPublic }] = useContext(AppContext);
  if (isPublic) {
    currentTab = "theme";
  }

  return (
    <div className="tab-content">
      {!isPublic ? (
        <>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "publicSettings" })}>
            <PublicUserSettings />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "passwordReset" })}>
            <PasswordReset />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "scanHistory" })}>
            <h1>Coming soon...</h1>
          </div>
        </>
      ) : null}
      <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "theme" })}>
        <ThemeChooser />
      </div>
    </div>
  );
};

const TabHeaders = ({ currentTab, setTab }) => {
  const [{ isPublic }] = useContext(AppContext);

  return isPublic ? (
    <div className="tab-headers">
      <div className="tab-header disabled">
        <a>Public settings</a>
      </div>
      <div className="tab-header disabled">
        <a>Reset password</a>
      </div>
      <div className="tab-header active">
        <a>Theme</a>
      </div>
      <div className="tab-header disabled">
        <a>Scan history</a>
      </div>
    </div>
  ) : (
    <div className="tab-headers">
      <div onClick={() => setTab("publicSettings")} className={classNames("tab-header", { active: currentTab == "publicSettings" })}>
        <a>Public settings</a>
      </div>
      <div onClick={() => setTab("passwordReset")} className={classNames("tab-header", { active: currentTab == "passwordReset" })}>
        <a>Reset password</a>
      </div>
      <div onClick={() => setTab("theme")} className={classNames("tab-header", { active: currentTab == "theme" })}>
        <a>Theme</a>
      </div>
      <div onClick={() => setTab("scanHistory")} className={classNames("tab-header", { active: currentTab == "scanHistory" })}>
        <a>Scan history</a>
      </div>
    </div>
  );
};

export default props => {
  const [currentTab, setCurrentTab] = useState(localStorageManager.get("settings-tab", "publicSettings"));
  const setTab = tab => {
    localStorageManager.set("settings-tab", tab);
    setCurrentTab(tab);
  };

  return (
    <div className="standard-module-container">
      <TabHeaders setTab={setTab} currentTab={currentTab} />
      <TabContent currentTab={currentTab} />
    </div>
  );
};
