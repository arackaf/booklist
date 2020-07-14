import React, { useContext, useState, useRef } from "react";

import PublicUserSettings from "./components/publicUserSettings/main";
import PasswordReset from "./components/passwordReset/main";
import ThemeChooser from "./components/themeChooser/main";
import { AppContext } from "app/renderUI";
import {Button} from "app/components/ui/Button";
import FlexRow from "app/components/layout/FlexRow";
import { TabHeader, TabHeaders, Tabs, TabContents, TabContent } from "app/components/layout/Tabs";

const SettingsTabContent = ({}) => {
  const [{ isPublic, isLoggedIn }] = useContext(AppContext);

  return (
    <TabContents>
      {!isPublic && isLoggedIn ? (
        <>
          <TabContent style={{ minHeight: "150px" }} tabName="publicSettings">
            <PublicUserSettings />
          </TabContent>
          <TabContent style={{ minHeight: "150px" }} tabName="passwordReset">
            <PasswordReset />
          </TabContent>
        </>
      ) : null}
      <>
        <TabContent style={{ minHeight: "150px" }} tabName="miscSettings">
          <MiscSettings />
        </TabContent>
        <TabContent style={{ minHeight: "150px" }} tabName="theme">
          <ThemeChooser />
        </TabContent>
      </>
    </TabContents>
  );
};

const SettingsTabHeaders = ({}) => {
  const [{ isPublic, isLoggedIn }] = useContext(AppContext);

  return isPublic || !isLoggedIn ? (
    <TabHeaders>
      <TabHeader disabled={true}>
        <a>Public sharing</a>
      </TabHeader>
      <TabHeader disabled={true}>
        <a>Reset password</a>
      </TabHeader>
      <TabHeader tabName="theme">
        <a>Theme</a>
      </TabHeader>
      <TabHeader tabName="miscSettings">
        <a>Misc</a>
      </TabHeader>
    </TabHeaders>
  ) : (
    <TabHeaders>
      <TabHeader tabName="publicSettings">
        <a>Public sharing</a>
      </TabHeader>
      <TabHeader tabName="passwordReset">
        <a>Reset password</a>
      </TabHeader>
      <TabHeader tabName="theme">
        <a>Theme</a>
      </TabHeader>
      <TabHeader tabName="miscSettings">
        <a>Misc</a>
      </TabHeader>
    </TabHeaders>
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
        <div className="form-group">
          <label>Suspense timeout</label>
          <input
            style={{ maxWidth: "150px" }}
            defaultValue={suspenseTimeout}
            ref={suspenseTimeoutEl}
            placeholder="Suspense timeout"
            className="form-control"
          />
          <Button style={{ margin: "10px 0", alignSelf: "flex-start" }} preset="primary" onClick={save}>
            Save
          </Button>

          {saved ? <div className="alert alert-success">Saved. Refresh the page to see the new timeout value in action</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}
        </div>
      </div>
    </FlexRow>
  );
};

export default props => {
  const [{ isPublic }] = useContext(AppContext);

  return (
    <div>
      <Tabs defaultTab={isPublic ? "theme" : "publicSettings"} localStorageName="settings-tab">
        <SettingsTabHeaders />
        <SettingsTabContent />
      </Tabs>
    </div>
  );
};
