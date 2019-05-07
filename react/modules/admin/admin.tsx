import React, { useContext, useState } from "react";
import classNames from "classnames";

import localStorageManager from "util/localStorage";
import { AppContext } from "app/renderUI";

import CoverManager from "./components/bookSummaryCovers/coverManager";

const TabContent = ({ currentTab }) => {
  return (
    <div className="tab-content">
      <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "covers" })}>
        <CoverManager />
      </div>
      <div style={{ minHeight: "150px" }} className={classNames("tab-pane", { active: currentTab == "user-data" })}>
        <div>TODO</div>
      </div>
    </div>
  );
};

const TabHeaders = ({ currentTab, setTab }) => {
  const [{ isPublic }] = useContext(AppContext);

  return (
    <div className="tab-headers">
      <div onClick={() => setTab("covers")} className={classNames("tab-header", { active: currentTab == "covers" })}>
        <a>Recommendation Covers</a>
      </div>
      <div onClick={() => setTab("user-data")} className={classNames("tab-header", { active: currentTab == "user-data" })}>
        <a>User Data</a>
      </div>
    </div>
  );
};

export default props => {
  const [currentTab, setCurrentTab] = useState(localStorageManager.get("admin-tab", "covers"));
  const setTab = tab => {
    localStorageManager.set("admin-tab", tab);
    setCurrentTab(tab);
  };

  return (
    <div style={{ margin: "10px", padding: "10px" }}>
      <TabHeaders setTab={setTab} currentTab={currentTab} />
      <TabContent currentTab={currentTab} />
    </div>
  );
};
