import React, { useContext, useState, useRef } from "react";

import PublicUserSettings from "./components/publicUserSettings/main";
import PasswordReset from "./components/passwordReset/main";
import ThemeChooser from "./components/themeChooser/main";
import { AppContext } from "app/state/appState";
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

      <TabContent style={{ minHeight: "150px" }} tabName="theme">
        <ThemeChooser />
      </TabContent>
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
    </TabHeaders>
  );
};

export default props => {
  const [{ isPublic }] = useContext(AppContext);

  return (
    <section>
      <Tabs defaultTab={isPublic ? "theme" : "publicSettings"} localStorageName="settings-tab">
        <SettingsTabHeaders />
        <SettingsTabContent />
      </Tabs>
    </section>
  );
};
