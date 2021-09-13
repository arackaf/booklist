import React, { FunctionComponent, useContext, useState, FC } from "react";
import Measure from "react-measure";
import "./d3-styles.scss";
import "d3-transition";

import { goto } from "reactStartup";

import { AppContext } from "app/renderUI";
import { useTagsState } from "app/state/tagsState";
import { Tabs, TabHeader, TabHeaders, TabContents, TabContent } from "app/components/layout/Tabs";
import { useStackedSubjects } from "app/state/subjectsState";
import barCharQuery from "graphQL/home/barChart.graphql";
import { clearCache } from "util/graphqlCacheHelpers";
import { graphqlClient } from "util/graphql";

import BarChart from "./components/barChart";
import RecommendMain from "./components/recommend/main";
import RecentScans from "./recent-scans";

graphqlClient.subscribeMutation(
  [/(create|update|delete)Subjects?/, /(create|update|delete)Books?/].map(when => ({ when, run: () => clearCache(barCharQuery) }))
);

const MainHomePane = props => (
  <div>
    <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "1200px" }}>
      <div className="">
        <div className="panel-body" style={{ position: "relative" }}>
          {props.children}
        </div>
      </div>
    </div>
  </div>
);

const MAX_CHART_WIDTH = 1100;

const HomeIfLoggedIn: FunctionComponent<{}> = props => {
  const { subjectsLoaded, subjects } = useStackedSubjects();
  const [tab, setTab] = useState("vis");
  useTagsState();

  return (
    <MainHomePane>
      <Tabs defaultTab="vis" localStorageName="home-tabs">
        <TabHeaders>
          <TabHeader tabName="vis">
            <a>
              <i className="far fa-chart-bar" /> View
            </a>
          </TabHeader>
          <TabHeader tabName="rec">
            <a>
              <span>Discover books</span>
            </a>
          </TabHeader>
          <TabHeader tabName="recent-scans">
            <a>
              <span>Recent scans</span>
            </a>
          </TabHeader>
        </TabHeaders>
        <TabContents>
          <TabContent tabName="vis">
            {
              active =>
                active ? (
                  subjectsLoaded ? (
                    subjects.length ? (
                      <ChartHolder />
                    ) : (
                      <div className="alert alert-warning inline-flex">
                        It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up
                        here.
                      </div>
                    )
                  ) : null
                ) : null /* tab not active - render nothing */
            }
          </TabContent>

          <TabContent tabName="rec">
            <RecommendMain />
          </TabContent>
          <TabContent tabName="recent-scans">
            <RecentScans />
          </TabContent>
        </TabContents>
      </Tabs>
    </MainHomePane>
  );
};

const ChartHolder: FC<{}> = props => {
  const { subjects, subjectHash } = useStackedSubjects();
  const [chartPackets, setChartPackets] = useState([{ subjects, header: "All books" }]);
  const [chartWidth, setChartWidth] = useState(MAX_CHART_WIDTH);

  const getDrilldownChart = (index, subjects, header) => {
    setChartPackets(charts => [...charts.slice(0, index + 1), { subjects: subjects.concat(), header }]);
  };

  return (
    <Measure
      client
      onResize={({ client }) => {
        if (client.width != chartWidth && client.width <= MAX_CHART_WIDTH) {
          setChartWidth(client.width);
        }
      }}
    >
      {({ measureRef }) => (
        <div ref={measureRef}>
          {chartPackets.map((packet, i) => (
            <BarChart
              key={i}
              drilldown={getDrilldownChart}
              subjectHash={subjectHash}
              {...packet}
              chartIndex={i}
              maxWidth={MAX_CHART_WIDTH}
              width={chartWidth}
              height={600}
            />
          ))}
        </div>
      )}
    </Measure>
  );
};

const HomeIfNotLoggedIn = () => (
  <div>
    <MainHomePane>
      <div style={{ display: "flex" }}>
        <div style={{ maxWidth: "800px", marginTop: "25px", marginLeft: "auto", marginRight: "auto" }}>
          Welcome to <i>My Library</i>.<br />
          <br />
          This site is my own little passion project, the purpose of which is to track your library. You scan in your books (or manually type in the
          isbn) and the books' info is fetched from Amazon, and stored for you. You can then flexibly search and categorize your library.
          <br />
          <br />
          So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot,
          own the books they read, and read non-eBooks. As I said, this is more of a passion project than anything.
          <br />
          <br />
          It's free to sign up, and store up to 500 books. In the remote chance someone actually wants to store more than that, there'll be some sort
          of nominal fee to help defray storage costs.
          <br />
          <br />
          For those interested in seeing the code for this site, the GitHub repository is{" "}
          <a target="_blank" href="https://github.com/arackaf/booklist">
            here
          </a>
          <br />
          <br />
          <a style={{ textDecoration: "none" }} className="btn btn-primary" onClick={() => goto("login")}>
            Login or create an account
          </a>
        </div>
      </div>
    </MainHomePane>
  </div>
);

const Home: FunctionComponent<{}> = props => {
  const [{ isLoggedIn, isPublic }] = useContext(AppContext);
  return <section>{isLoggedIn || isPublic ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn />}</section>;
};
export default Home;
