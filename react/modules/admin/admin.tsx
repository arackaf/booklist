import React, { useState } from "react";

import CoverManager from "./components/bookSummaryCovers/coverManager";
import { TabContents, TabContent, TabHeaders, TabHeader, Tabs } from "app/components/layout/Tabs";
import SummaryQuery from "graphQL/admin/bookSummaryCoverInfo.graphql";
import { graphqlSyncAndRefresh } from "util/graphqlHelpers";
import ajaxUtil from "util/ajaxUtil";
import { getLoginStatus } from "util/loginStatus";

graphqlSyncAndRefresh("BookSummary", SummaryQuery);

const AdminTabContent = ({}) => {
  return (
    <TabContents>
      <TabContent style={{ minHeight: "150px" }} tabName="covers">
        <CoverManager />
      </TabContent>

      <TabContent style={{ minHeight: "150px" }} tabName="scan">
        <button
          className="btn btn-xs margin-left"
          onClick={() => {
            const wait = ms => new Promise(res => setTimeout(res, ms));
            (async function () {
              const delay = 250;
              for (let i = 0; i < 1; i++) {
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0198788606", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780618918249", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9798577932152", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780553380163", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "039330700X", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "9780393308181", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "334455", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0142003344", ...getLoginStatus() });
                await wait(delay);
                ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn: "0465072704", ...getLoginStatus() });
                await wait(delay);
              }
            })();
          }}
        >
          TEST
        </button>
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
      <TabHeader tabName="scan">
        <a>Test Scan</a>
      </TabHeader>
      <TabHeader tabName="user-data">
        <a>User Data</a>
      </TabHeader>
    </TabHeaders>
  );
};

export default ({}) => {
  return (
    <section>
      <Tabs defaultTab="covers" localStorageName="admin-tabs">
        <AdminTabHeaders />
        <AdminTabContent />
      </Tabs>
    </section>
  );
};
