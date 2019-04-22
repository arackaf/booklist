import React, { Component } from "react";
import classNames from "classnames";

import PublicUserSettings from "./publicUserSettings/main";
import PasswordReset from "./passwordReset/main";
import ThemeChooser from "./themeChooser/main";
import localStorageManager from "util/localStorage";

export default class PublicUserSettingsMain extends Component<any, any> {
  state = { currentTab: localStorageManager.get("settings-tab", "publicSettings") };
  setTab = tab => {
    localStorageManager.set("settings-tab", tab);
    this.setState({ currentTab: tab });
  };
  render() {
    let currentTab = this.state.currentTab;
    return (
      <div style={{ margin: "10px", padding: "10px" }}>
        <div className="tab-headers">
          <div onClick={() => this.setTab("publicSettings")} className={classNames("tab-header", { active: currentTab == "publicSettings" })}>
            <a>Public settings</a>
          </div>
          <div onClick={() => this.setTab("passwordReset")} className={classNames("tab-header", { active: currentTab == "passwordReset" })}>
            <a>Reset password</a>
          </div>
          <div onClick={() => this.setTab("theme")} className={classNames("tab-header", { active: currentTab == "theme" })}>
            <a>Theme</a>
          </div>
          <div onClick={() => this.setTab("scanHistory")} className={classNames("tab-header", { active: currentTab == "scanHistory" })}>
            <a>Scan history</a>
          </div>
        </div>
        <div className="tab-content">
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "publicSettings" })}>
            <PublicUserSettings />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "passwordReset" })}>
            <PasswordReset />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "theme" })}>
            <ThemeChooser />
          </div>
          <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "scanHistory" })}>
            <h1>Coming soon...</h1>
          </div>
        </div>
      </div>
    );
  }
}
