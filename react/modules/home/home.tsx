import React, { FunctionComponent, useContext, useState, useEffect } from "react";
import Measure from "react-measure";
import "d3-transition";

import BarChart from "./components/barChart";
import { AppContext } from "app/renderUI";
import { useStackedSubjects, useSubjectsState } from "app/subjectsState";
import RecommendMain from "./components/recommend/main";

import "./d3-styles.scss";

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
  const [state, setState] = useState({ chartPackets: [], chartWidth: MAX_CHART_WIDTH });
  const { subjectHash, subjectsLoaded } = useSubjectsState();
  const { subjects } = useStackedSubjects();

  useEffect(() => {
    if (subjectsLoaded) {
      getTopChart();
    }
  }, [subjectsLoaded]);

  const getTopChart = () => {
    setState({ ...state, chartPackets: [{ subjects: subjects, header: "All books" }] });
  };
  const getDrilldownChart = (index, subjects, header) => {
    setState({ ...state, chartPackets: [...state.chartPackets.slice(0, index + 1), { subjects, header }] });
  };
  const [tab, setTab] = useState("vis");

  const { chartPackets } = state;
  return (
    <MainHomePane>
      <div className="tab-headers">
        <div className={"tab-header " + (tab == "vis" ? "active" : "")}>
          <a onClick={() => setTab("vis")}>
            <span>
              <i className="far fa-chart-bar" /> View
            </span>
          </a>
        </div>
        <div className={"tab-header " + (tab == "rec" ? "active" : "")}>
          <a onClick={() => setTab("rec")}>
            <span>Discover books</span>
          </a>
        </div>
      </div>
      <div className="tab-content">
        <div className={"tab-pane " + (tab == "vis" ? "active" : "")}>
          <br />
          {tab == "vis" ? (
            <Measure
              client
              onResize={({ client }) => {
                if (client.width != state.chartWidth && client.width <= MAX_CHART_WIDTH) {
                  setState({ ...state, chartWidth: client.width });
                }
              }}
            >
              {({ measureRef }) => (
                <div ref={measureRef}>
                  {subjectsLoaded
                    ? chartPackets.map((packet, i) => (
                        <BarChart
                          key={i}
                          {...packet}
                          {...{ subjectHash, subjectsLoaded }}
                          drilldown={getDrilldownChart}
                          chartIndex={i}
                          width={state.chartWidth}
                          height={600}
                        />
                      ))
                    : null}
                </div>
              )}
            </Measure>
          ) : null}
        </div>
        <div className={"tab-pane " + (tab == "rec" ? "active" : "")}>
          <RecommendMain />
        </div>
      </div>

      {/* <Tab name="search" caption="Discover books">
        </Tab>
      </Tabs> */}
    </MainHomePane>
  );
};

const HomeIfNotLoggedIn = () => (
  <div>
    <MainHomePane>
      Welcome to <i>My Library</i>.<br />
      <br />
      This site is my own little passion project, the purpose of which is to track your library. You scan in your books (or manually type in the isbn)
      and the books' info is fetched from Amazon, and stored for you. You can then flexibly search and categorize your library.
      <br />
      <br />
      So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot, own
      the books they read, and read non-eBooks. As I said, this is more of a passion project than anything.
      <br />
      <br />
      It's free to sign up, and store up to 500 books. In the remote chance someone actually wants to store more than that, there'll be some sort of
      nominal fee to help defray storage costs.
      <br />
      <br />
      For those interested in seeing the code for this site, the GitHub repository is{" "}
      <a target="_blank" href="https://github.com/arackaf/booklist">
        here
      </a>
      <br />
      <br />
      <a style={{ textDecoration: "none" }} className="btn btn-primary" href="/login">
        Login or create an account
      </a>
    </MainHomePane>
  </div>
);

const Home: FunctionComponent<{}> = props => {
  const [{ isLoggedIn }] = useContext(AppContext);
  return <div className="container-fluid standard-module-container">{isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn />}</div>;
};
export default Home;
