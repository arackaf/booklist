import React, { PureComponent, FC, memo, useRef, useState, useEffect, DOMElement, useMemo } from "react";

import scaleLinear from "d3-scale/src/linear";
import scaleBand from "d3-scale/src/band";
import max from "d3-array/src/max";

import Bar from "./bar";
import Axis from "./axis";

import barCharQuery from "graphQL/home/barChart.graphql";
import { computeSubjectParentId, getChildSubjectsSorted, useSubjectsState } from "app/subjectsState";
import { useQuery, buildQuery } from "micro-graphql-react";

const stackGraphData = (subjectHash, subjectIds, data) => {
  if (!data) return null;
  
  let targetSubjectsLookup = new Set(subjectIds);

  let subjectResultsMap = new Map<string, number>([]);

  data.allBooks.Books.forEach(item => {
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

  return Array.from(subjectResultsMap).map(([name, count], i) => {
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
};

const BarChart: FC<any> = memo(({ subjects, chartIndex, width, height, drilldown, header }) => {
  const [left, setLeft] = useState(0);
  const [excluding, setExcluding] = useState({});

  const elRef = useRef<any>();
  const barMap = new Map();

  const removeBar = id => setExcluding(excluding => ({ ...excluding, [id]: true }));
  const restoreBar = id => setExcluding(excluding => ({ ...excluding, [id]: false }));

  const { subjectHash } = useSubjectsState();
  const subjectIds = subjects.map(s => s._id);
  const { data: newRespData } = useQuery(buildQuery(barCharQuery, { subjectIds, searchChildSubjects: true }));
  const graphData = stackGraphData(subjectHash, subjectIds, newRespData);

  useEffect(() => {
    if (elRef.current && graphData && chartIndex > 0) {
      elRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [graphData]);

  const topRef = el => {
    if (!el) return;
    if (el != elRef.current) {
      elRef.current = el;
      el.addEventListener("touchstart", svgTouch);
    }
  };
  const clearOnTouch = new Set(["text", "h4", "div", "svg"]);
  const svgTouch = evt => {
    if (clearOnTouch.has(evt.target.tagName.toLowerCase())) {
      if (graphData) {
        graphData.forEach(d => {
          let componentMaybe = barMap.get(d.groupId);
          componentMaybe && componentMaybe.hideTooltip();
        });
      }
    }
  };

  const margin = { top: 20, right: 10, bottom: 180, left: 0 };

  if (!graphData || !graphData.length) {
    return null;
  }

  const showingData = graphData.filter(d => !excluding[d.groupId]);
  width = Math.min(width, showingData.length * 110 + 60);

  const dataValues = showingData.map(({ count }) => count);
  const displayValues = showingData.map(({ display }) => display);
  const chartHeight = height - margin.top - margin.bottom;
  const dataMax = max(dataValues);
  const dataScale = scaleLinear()
    .domain([0, dataMax])
    .range([0, chartHeight]);
  const scaleX = scaleBand()
    .domain(displayValues)
    .range([0, width])
    .paddingInner([0.1])
    .paddingOuter([0.3])
    .align([0.5]);
  const svgStyle = { display: "block", marginLeft: "auto", marginRight: "auto" }; //, marginLeft: 'auto', marginRight: 'auto'};

  const excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  return (
    <div ref={topRef}>
      <div style={{ ...width, height }}>
        <div>
          <h4 style={{ display: "inline" }}>{header}</h4>
          {excludedCount ? (
            <span style={{ marginLeft: "10px" }}>
              Excluding:&nbsp;
              {graphData
                .filter(d => excluding[d.groupId])
                .map(d => (
                  <span style={{ marginLeft: "10px" }}>
                    {d.display}{" "}
                    <a style={{ color: "black" }} onClick={() => restoreBar(d.groupId)}>
                      <i className="far fa-redo" />
                    </a>
                  </span>
                ))}
            </span>
          ) : null}
        </div>
        <svg style={svgStyle} width={width} height={height}>
          <g transform={`scale(1, -1) translate(${margin.left}, ${margin.bottom - height})`}>
            {showingData
              .filter(d => !excluding[d.groupId])
              .map((d, i) => (
                <Bar
                  ref={el => barMap.set(d.groupId, el)}
                  drilldown={drilldown}
                  chartIndex={chartIndex}
                  removeBar={removeBar}
                  key={d.groupId}
                  index={i}
                  data={d}
                  count={showingData.length}
                  x={scaleX(d.display)}
                  y={0}
                  width={scaleX.bandwidth()}
                  height={dataScale(d.count)}
                  graphWidth={width}
                  adjustTooltip={left}
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
});

export default BarChart;
