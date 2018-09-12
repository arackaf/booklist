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
        <h4 className="heading">
          {display}: <span>{data.count}</span>
        </h4>
        <button className="btn btn-xs" onClick={this.props.removeBar}>
          <i className="far fa-undo" />
        </button>
        {childSubjects.length ? (
          <button className="btn btn-xs" style={{ marginLeft: "5px" }} onClick={() => drilldown(chartIndex, childSubjects, display)}>
            <i className="far fa-angle-double-down" />
          </button>
        ) : null}
      </div>
    );
  }
}
