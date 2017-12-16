import React, { Component, PureComponent } from "react";

import scaleLinear from "d3-scale/src/linear";
import scaleBand from "d3-scale/src/band";
import max from "d3-array/src/max";

import Bar from "./bar";
import Axis from "./axis";

export default class BarChart extends PureComponent<any, any> {
  state = { left: 0, excluding: {} };
  sized = ({ bounds }) => {
    if (bounds.left != this.state.left) {
      this.setState({ left: bounds.left });
    }
  };
  removeBar = id => this.setState((state, props) => ({ excluding: { ...state.excluding, [id]: true } }));
  restoreBar = id => this.setState((state, props) => ({ excluding: { ...state.excluding, [id]: false } }));

  render() {
    let margin = { top: 20, right: 10, bottom: 180, left: 0 },
      { data, width, height } = this.props,
      { excluding } = this.state;

    if (!data || !data.length) {
      return null;
    }
    let fullData = data;

    data = data.filter(d => !excluding[d.groupId]);

    let dataValues = data.map(({ count }) => count),
      displayValues = data.map(({ display }) => display),
      chartHeight = height - margin.top - margin.bottom,
      dataMax = max(dataValues),
      dataScale = scaleLinear()
        .domain([0, dataMax])
        .range([0, chartHeight]),
      scaleX = scaleBand()
        .domain(displayValues)
        .range([0, width])
        .paddingInner([0.1])
        .paddingOuter([0.3])
        .align([0.5]),
      style = { display: "block" }; //, marginLeft: 'auto', marginRight: 'auto'};
    {
      /*<Measure bounds={true} onResize={this.sized}>
                  {({measureRef}) => (*/
      /*    )}
              </Measure> ref={measureRef} */
    }

    let excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
    return (
      <div>
        <span>
          <h4 style={{ display: "inline" }}>All Books.</h4>
          {excludedCount ? (
            <span style={{ marginLeft: "10px" }}>
              Excluding:{" "}
              {fullData.filter(d => excluding[d.groupId]).map((d, i, arr) => (
                <span style={{ marginLeft: "10px" }}>
                  {d.display}{" "}
                  <a onClick={() => this.restoreBar(d.groupId)}>
                    <i className="fa fa-fw fa-undo" />
                  </a>
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <svg style={style} width={width} height={height}>
          <g transform={`scale(1, -1) translate(${margin.left}, ${margin.bottom - height})`}>
            {data
              .filter(d => !this.state.excluding[d.groupId])
              .map((d, i) => (
                <Bar
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
    );
  }
}
