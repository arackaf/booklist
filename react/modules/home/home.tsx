import React, { FunctionComponent, useContext, useState, FC } from "react";
import Measure from "react-measure";
import "d3-transition";

import BarChart from "./components/barChart";
import { AppContext } from "app/renderUI";
import { useStackedSubjects } from "app/subjectsState";
import RecommendMain from "./components/recommend/main";

import "./d3-styles.scss";
import { SectionLoading } from "app/components/loading";

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
            subjectsLoaded ? (
              subjects.length ? (
                <ChartHolder />
              ) : (
                <div className="alert alert-warning">
                  It looks like you haven't entered any books yet. Once you do, you'll see info about your library here.
                </div>
              )
            ) : (
              <SectionLoading style={{ position: "fixed" }} />
            )
          ) : null /* tab not active - render nothing */}
        </div>
        <div className={"tab-pane " + (tab == "rec" ? "active" : "")}>
          <RecommendMain />
        </div>
      </div>
    </MainHomePane>
  );
};

const ChartHolder: FC<{}> = props => {
  const { subjects, subjectHash } = useStackedSubjects();
  const [chartPackets, setChartPackets] = useState([{ subjects, header: "All books" }]);
  const [chartWidth, setChartWidth] = useState(MAX_CHART_WIDTH);

  const getDrilldownChart = (index, subjects, header) => {
    setChartPackets(charts => [...charts.slice(0, index + 1), { subjects, header }]);
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
            <BarChart key={i} drilldown={getDrilldownChart} subjectHash={subjectHash} {...packet} chartIndex={i} width={chartWidth} height={600} />
          ))}
        </div>
      )}
    </Measure>
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
