import React, { Component, PureComponent } from "react";

export default class Tooltip extends PureComponent<any, any> {
  render() {
    let { data, count, childSubjects, removeBar, drilldown, chartIndex } = this.props,
      display = data.entries
        .map(e => e.name)
        .sort()
        .join(",");

    return (
      <div style={{ position: "relative", marginLeft: "-5px" }}>
        <a
          onClick={this.props.removeBar}
          style={{ position: "absolute", top: 0, right: 0, marginRight: -20, marginTop: -15, textDecoration: "none" }}
        >
          X
        </a>
        <h4 style={{ margin: 0, paddingBottom: "5px" }}>
          {display}: <span>{data.count}</span>
          <div>{childSubjects.length ? <a onClick={() => drilldown(chartIndex, childSubjects)}>Drilldown</a> : null}</div>
        </h4>
        <br />
      </div>
    );
  }
}
