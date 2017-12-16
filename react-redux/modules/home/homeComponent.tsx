import React, { Component, PureComponent } from "react";
import { findDOMNode, render } from "react-dom";
import { connect } from "react-redux";
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
    <div style={{ marginLeft: "auto", marginRight: "auto", width: "1200px" }}>
      <div className="panel panel-default">
        <div className="panel-body" style={{ position: "relative" }}>
          {props.children}
        </div>
      </div>
    </div>
  </div>
);

@connect(
  (state: RootApplicationType) => ({
    subjects: topLevelSubjectsSortedSelector(state),
    subjectHash: state.app.subjectHash,
    subjectsLoaded: state.app.subjectsLoaded
  }),
  { loadSubjects }
)
class HomeIfLoggedIn extends Component<any, any> {
  state = { data: null, drilldownData: null };
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
    this.getChart(this.props.subjects).then(data => this.setState({ data }));
  };
  getDrilldownChart = subjects => {
    this.getChart(subjects).then(drilldownData => this.setState({ drilldownData }));
  };
  getChart = subjects => {
    let subjectIds = subjects.map(s => s._id),
      targetSubjectsLookup = new Set(subjectIds),
      subjectHash = this.props.subjectHash;

    let subjectResultsMap = new Map<string, number>([]);

    function getApplicableRootSubject(subject) {
      let parentId = computeSubjectParentId(subject.path);

      if (!parentId) {
        return subject;
      } else if (targetSubjectsLookup.has(parentId)) {
        return subjectHash[parentId];
      } else {
        return getApplicableRootSubject(subjectHash[parentId]);
      }
    }

    return ajaxUtil.post("/book/booksBySubjects", { subjects: subjectIds, gatherToParents: 1 }).then(resp => {
      resp.results.forEach(item => {
        let subjectsHeld = item.subjects
          .filter(_id => subjectHash[_id])
          .map(_id => (targetSubjectsLookup.has(_id) ? _id : getApplicableRootSubject(subjectHash[_id])._id));

        let uniqueSubjects = Array.from(new Set(subjectsHeld)),
          uniqueSubjectString = uniqueSubjects.sort().join(",");

        if (!subjectResultsMap.has(uniqueSubjectString)) {
          subjectResultsMap.set(uniqueSubjectString, 0);
        }
        subjectResultsMap.set(uniqueSubjectString, subjectResultsMap.get(uniqueSubjectString) + 1);
      });

      let finalData = Array.from(subjectResultsMap).map(([name, count], i) => {
        let _ids = name.split(",").filter(s => s);
        debugger;

        let names = _ids
          .map(_id => subjectHash[_id].name)
          .sort()
          .join(",");

        return {
          groupId: name,
          count,
          display: names,
          entries: _ids.map(_id => {
            let subject = subjectHash[_id];
            return {
              name: subject.name,
              color: subject.backgroundColor,
              children: getChildSubjectsSorted(_id, subjectHash)
            };
          })
        };
      });

      return finalData;
    });
  };
  render() {
    //[5, 10, 4, 5, 7, 11, /*6, 31, 3, 7, 9, 18, 5, 22, 5*/]
    let { data, drilldownData } = this.state;
    return (
      <div>
        <MainHomePane>
          Welcome to <i>My Library</i>. Below is the beginnings of a data visualization of your library. More to come!
          <hr />
          {data ? <BarChart data={data} drilldown={this.getDrilldownChart} width={1100} height={600} /> : null}
          <br />
          <br />
          {drilldownData ? <BarChart data={drilldownData} drilldown={this.getDrilldownChart} width={1100} height={600} /> : null}
          <br />
          <br />
          <br />
          <br />
        </MainHomePane>
      </div>
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
