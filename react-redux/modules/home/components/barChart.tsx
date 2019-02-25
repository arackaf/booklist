import React, { PureComponent } from "react";
import { connect } from "react-redux";

import scaleLinear from "d3-scale/src/linear";
import scaleBand from "d3-scale/src/band";
import max from "d3-array/src/max";

import Bar from "./bar";
import Axis from "./axis";

import { getChildSubjectsSorted, computeSubjectParentId, RootApplicationType } from "applicationRoot/rootReducer";
import barCharQuery from "graphQL/home/barChart.graphql";
import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

function getSubjectsList(subjectIds) {
  return graphqlClient.runQuery(barCharQuery, { subjectIds, searchChildSubjects: true });
}

@connect((state: RootApplicationType) => ({
  subjectHash: state.app.subjectHash,
  subjectsLoaded: state.app.subjectsLoaded
}))
export default class BarChart extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = { left: 0, excluding: {}, data: null, initialWidth: props.width };
  }
  el: any;
  barMap = new Map();
  sized = ({ bounds }) => {
    if (bounds.left != this.state.left) {
      this.setState({ left: bounds.left });
    }
  };
  removeBar = id => this.setState((state, props) => ({ excluding: { ...state.excluding, [id]: true } }));
  restoreBar = id => this.setState((state, props) => ({ excluding: { ...state.excluding, [id]: false } }));

  componentDidMount() {
    this.getChart(() => {
      if (this.props.chartIndex > 0) {
        this.el.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.subjects != this.props.subjects) {
      this.getChart();
    }
  }

  getChart = (cb?: any) => {
    let { subjects, subjectHash } = this.props;
    let subjectIds = subjects.map(s => s._id);
    let targetSubjectsLookup = new Set(subjectIds);

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

    return getSubjectsList(subjectIds).then(resp => {
      resp.data.allBooks.Books.forEach(item => {
        let subjectsHeld = item.subjects
          .filter(_id => subjectHash[_id])
          .map(_id => (targetSubjectsLookup.has(_id) ? _id : getApplicableRootSubject(subjectHash[_id])._id));

        let uniqueSubjects = Array.from(new Set(subjectsHeld));
        let uniqueSubjectString = uniqueSubjects.sort().join(",");

        if (!subjectResultsMap.has(uniqueSubjectString)) {
          subjectResultsMap.set(uniqueSubjectString, 0);
        }
        subjectResultsMap.set(uniqueSubjectString, subjectResultsMap.get(uniqueSubjectString) + 1);
      });

      let data = Array.from(subjectResultsMap).map(([name, count], i) => {
        let _ids = name.split(",").filter(s => s);
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

      this.setState({ data }, cb);
    });
  };

  topRef = el => {
    if (!el) return;
    el.addEventListener("touchstart", this.svgTouch);
  };
  clearOnTouch = new Set(["text", "h4", "div", "svg"]);
  svgTouch = evt => {
    if (this.clearOnTouch.has(evt.target.tagName.toLowerCase())) {
      if (Array.isArray(this.state.data)) {
        this.state.data.forEach(d => {
          let componentMaybe = this.barMap.get(d.groupId);
          componentMaybe && componentMaybe.hideTooltip();
        });
      }
    }
  };

  clearAllTooltips = () => {};

  render() {
    let margin = { top: 20, right: 10, bottom: 180, left: 0 };
    let { subjectsLoaded, width, height, drilldown, chartIndex, header } = this.props;
    let { data, excluding } = this.state;

    if (!subjectsLoaded || !data || !data.length) {
      return null;
    }
    let fullData = data;

    data = data.filter(d => !excluding[d.groupId]);
    width = Math.min(width, data.length * 110 + 60);

    let dataValues = data.map(({ count }) => count);
    let displayValues = data.map(({ display }) => display);
    let chartHeight = height - margin.top - margin.bottom;
    let dataMax = max(dataValues);
    let dataScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, chartHeight]);
    let scaleX = scaleBand()
      .domain(displayValues)
      .range([0, width])
      .paddingInner([0.1])
      .paddingOuter([0.3])
      .align([0.5]);
    let svgStyle = { display: "block", marginLeft: "auto", marginRight: "auto" }; //, marginLeft: 'auto', marginRight: 'auto'};

    let excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
    return (
      <div
        ref={el => {
          this.topRef(el);
          this.el = el;
        }}
      >
        <div style={{ ...width, height }}>
          <div>
            <h4 style={{ display: "inline" }}>{header}</h4>
            {excludedCount ? (
              <span style={{ marginLeft: "10px" }}>
                Excluding:{" "}
                {fullData
                  .filter(d => excluding[d.groupId])
                  .map((d, i, arr) => (
                    <span style={{ marginLeft: "10px" }}>
                      {d.display}{" "}
                      <a style={{ color: "black" }} onClick={() => this.restoreBar(d.groupId)}>
                        <i className="far fa-redo" />
                      </a>
                    </span>
                  ))}
              </span>
            ) : null}
          </div>
          <svg style={svgStyle} width={width} height={height}>
            <g transform={`scale(1, -1) translate(${margin.left}, ${margin.bottom - height})`}>
              {data
                .filter(d => !this.state.excluding[d.groupId])
                .map((d, i) => (
                  <Bar
                    ref={el => this.barMap.set(d.groupId, el)}
                    drilldown={drilldown}
                    chartIndex={chartIndex}
                    removeBar={this.removeBar}
                    key={d.groupId}
                    index={i}
                    data={d}
                    count={data.length}
                    x={scaleX(d.display)}
                    y={0}
                    width={scaleX.bandwidth()}
                    height={dataScale(d.count)}
                    graphWidth={width}
                    adjustTooltip={this.state.left}
                  />
                ))}
            </g>
            <g transform={`translate(${margin.left}, ${-1 * margin.bottom})`}>
              <Axis scale={scaleX} transform={`translate(0, ${height})`} />
            </g>
          </svg>
        </div>
        <hr />
      </div>
    );
  }
}
