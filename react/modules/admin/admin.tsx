import React, { useState } from "react";

import CoverManager from "./components/bookSummaryCovers/coverManager";
import { TabContents, TabContent, TabHeaders, TabHeader, Tabs } from "app/components/layout/Tabs";

const AdminTabContent = ({}) => {
  return (
    <TabContents>
      <TabContent style={{ minHeight: "150px" }} tabName="covers">
        <CoverManager />
      </TabContent>

      <TabContent style={{ minHeight: "150px" }} tabName="user-data">
        <div>TODO</div>
      </TabContent>
    </TabContents>
  );
};

const AdminTabHeaders = ({}) => {
  return (
    <TabHeaders>
      <TabHeader tabName="covers">
        <a>Recommendation Covers</a>
      </TabHeader>
      <TabHeader tabName="user-data">
        <a>User Data</a>
      </TabHeader>
    </TabHeaders>
  );
};

export default ({}) => {
  return (
    <div className="standard-module-container">
      <Tabs defaultTab="covers" localStorageName="admin-tabs">
        <AdminTabHeaders />
        <AdminTabContent />
      </Tabs>
    </div>
  );
};
