import React, { useContext, useState, useRef } from "react";
import classNames from "classnames";

import PublicUserSettings from "./components/publicUserSettings/main";
import PasswordReset from "./components/passwordReset/main";
import ThemeChooser from "./components/themeChooser/main";
import localStorageManager from "util/localStorage";
import { AppContext } from "app/renderUI";
import BootstrapButton from "app/components/bootstrapButton";
import FlexRow from "app/components/layout/FlexRow";

const TabContent = ({ currentTab }) => {
  const [{ isPublic, isLoggedIn }] = useContext(AppContext);
  if (isPublic && currentTab != "theme" && currentTab != "miscSettings") {
    currentTab = "theme";
  }

  return (
    <div className="tab-content">
      {!isPublic && isLoggedIn ? (
        <>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "publicSettings" })}>
            <PublicUserSettings />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "passwordReset" })}>
            <PasswordReset />
          </div>
        </>
      ) : null}
      <>
        <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "miscSettings" })}>
          <MiscSettings />
        </div>
        <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "theme" })}>
          <ThemeChooser />
        </div>
      </>
    </div>
  );
};

const TabHeaders = ({ currentTab, setTab }) => {
  const [{ isPublic, isLoggedIn }] = useContext(AppContext);

  return isPublic || !isLoggedIn ? (
    <div className="tab-headers">
      <div className="tab-header disabled">
        <a>Public sharing</a>
      </div>
      <div className="tab-header disabled">
        <a>Reset password</a>
      </div>
      <div onClick={() => setTab("theme")} className={classNames("tab-header", { active: currentTab == "theme" })}>
        <a>Theme</a>
      </div>
      <div onClick={() => setTab("miscSettings")} className={classNames("tab-header", { active: currentTab == "miscSettings" })}>
        <a>Misc</a>
      </div>
    </div>
  ) : (
    <div className="tab-headers">
      <div onClick={() => setTab("publicSettings")} className={classNames("tab-header", { active: currentTab == "publicSettings" })}>
        <a>Public sharing</a>
      </div>
      <div onClick={() => setTab("passwordReset")} className={classNames("tab-header", { active: currentTab == "passwordReset" })}>
        <a>Reset password</a>
      </div>
      <div onClick={() => setTab("theme")} className={classNames("tab-header", { active: currentTab == "theme" })}>
        <a>Theme</a>
      </div>
      <div onClick={() => setTab("miscSettings")} className={classNames("tab-header", { active: currentTab == "miscSettings" })}>
        <a>Misc</a>
      </div>
    </div>
  );
};

const MiscSettings = props => {
  const [suspenseTimeout, setSuspenseTimeout] = useState(() => {
    const suspenseTimeoutValue = parseInt(localStorage.getItem("suspense-timeout"));
    return isNaN(suspenseTimeoutValue) ? 3000 : suspenseTimeoutValue;
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const suspenseTimeoutEl = useRef(null);

  const save = () => {
    setSaved(false);

    const suspenseTimeoutValue = +suspenseTimeoutEl.current.value;
    if (isNaN(suspenseTimeoutValue) || suspenseTimeoutValue <= 0) {
      return setError("Please enter a positive number");
    }
    localStorage.setItem("suspense-timeout", suspenseTimeoutValue + "");
    setError("");
    setSaved(true);
  };

  return (
    <FlexRow>
      <div className="col-md-6 col-sm-12">
        <div style={{ paddingLeft: "10px", paddingTop: "20px" }}>
          <div className="form-group">
            <label>Suspense timeout</label>
            <input
              style={{ maxWidth: "150px" }}
              defaultValue={suspenseTimeout}
              ref={suspenseTimeoutEl}
              placeholder="Suspense timeout"
              className="form-control"
            />
            <BootstrapButton style={{ margin: "10px 0", alignSelf: "flex-start" }} preset="primary" onClick={save}>
              Save
            </BootstrapButton>

            {saved ? <div className="alert alert-success">Saved. Refresh the page to see the new timeout value in action</div> : null}
            {error ? <div className="alert alert-danger">{error}</div> : null}
          </div>
        </div>
      </div>
    </FlexRow>
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
