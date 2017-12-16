import React, { Component, PureComponent } from "react";

export default class Tooltip extends PureComponent<any, any> {
  render() {
    let { data, count, removeBar } = this.props,
      display = data.entries
        .map(e => e.name)
        .sort()
        .join(",");

    return (
      <div>
        <h4 style={{ margin: 0 }}>
          {display}: <span>{data.count}</span>
        </h4>
        <br />
        <a onClick={this.props.removeBar}>Remove</a>
      </div>
    );
  }
}
