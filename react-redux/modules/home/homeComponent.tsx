import React, { Component, PureComponent } from "react";
import { findDOMNode, render } from "react-dom";
import { connect } from "react-redux";
import Measure from "react-measure";

import { isLoggedIn } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";
import "d3-transition";

import { loadSubjects } from "applicationRoot/rootReducerActionCreators";
import {
  topLevelSubjectsSortedSelector,
  RootApplicationType,
  getRootSubject,
  getChildSubjectsSorted,
  computeSubjectParentId
} from "applicationRoot/rootReducer";

import BarChart from "./components/barChart";
import Bar from "./components/bar";
import Axis from "./components/axis";

const MainHomePane = props => (
  <div style={{ margin: 0 }}>
    <div style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "1200px" }}>
      <div className="panel panel-default">
        <div className="panel-body" style={{ position: "relative" }}>
          {props.children}
        </div>
      </div>
    </div>
  </div>
);

const MAX_CHART_WIDTH = 1100;
@connect(
  (state: RootApplicationType) => ({
    subjects: topLevelSubjectsSortedSelector(state),
    subjectHash: state.app.subjectHash,
    subjectsLoaded: state.app.subjectsLoaded
  }),
  { loadSubjects }
)
class HomeIfLoggedIn extends Component<any, any> {
  state = { chartPackets: [], chartWidth: MAX_CHART_WIDTH };
  componentDidMount() {
    if (this.props.subjectsLoaded) {
      this.getTopChart();
    } else {
      this.props.loadSubjects();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.subjectsLoaded && this.props.subjectsLoaded) {
      this.getTopChart();
    }
  }
  getTopChart = () => {
    this.setState({ chartPackets: [{ subjects: this.props.subjects, header: "All books" }] });
  };
  getDrilldownChart = (index, subjects, header) => {
    this.setState({ chartPackets: [...this.state.chartPackets.slice(0, index + 1), { subjects, header }] });
  };

  render() {
    let { subjectsLoaded, subjectHash } = this.props;
    let { chartPackets } = this.state;
    return (
      <MainHomePane>
        <Measure
          client
          onResize={({ client }) => {
            if (client.width != this.state.chartWidth && client.width <= MAX_CHART_WIDTH) {
              this.setState({ chartWidth: client.width });
            }
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef}>
              Welcome to <i>My Library</i>. Below is the beginnings of a data visualization of your library. More to come!
              <hr />
              {subjectsLoaded
                ? chartPackets.map((packet, i) => (
                    <BarChart {...packet} drilldown={this.getDrilldownChart} chartIndex={i} width={this.state.chartWidth} height={600} />
                  ))
                : null}
            </div>
          )}
        </Measure>
      </MainHomePane>
    );
  }
}

const HomeIfNotLoggedIn = () => (
  <div>
    <MainHomePane>
      Welcome to <i>My Library</i>.
      <br />
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
      <a className="btn btn-primary" href="/login">
        Login or create an account
      </a>
    </MainHomePane>
  </div>
);

export default class Home extends Component<any, any> {
  state = { isLoggedIn: isLoggedIn().logged_in };
  render() {
    return (
      <div style={{ paddingLeft: 0, paddingRight: 0 }} className="container-fluid">
        {this.state.isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn />}
      </div>
    );
  }
}
