import React, { FC, memo, useRef, useState, useEffect, useContext, useMemo, useCallback } from "react";

import { useSpring, config, animated } from "react-spring";

import scaleLinear from "d3-scale/src/linear";
import scaleBand from "d3-scale/src/band";
import max from "d3-array/src/max";

import Bar from "./bar";
import Axis from "./axis";

import barCharQuery from "graphQL/home/barChart.graphql";
import { computeSubjectParentId, getChildSubjectsSorted, useSubjectsState } from "app/state/subjectsState";
import { useQuery } from "micro-graphql-react";
import { graphqlClient } from "util/graphql";
import { clearCache } from "util/graphqlCacheHelpers";
import { AppContext } from "app/renderUI";
import SvgTooltip from "./SvgTooltip";

graphqlClient.subscribeMutation([/(update|delete)Subjects?/, /(update|delete)Books?/].map(when => ({ when, run: () => clearCache(barCharQuery) })));

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

const BarChart: FC<any> = memo(({ subjects, chartIndex, width, height, drilldown, maxWidth, header }) => {
  const [excluding, setExcluding] = useState({});
  const [{ publicUserId }] = useContext(AppContext);

  const elRef = useRef<any>();
  const barMap = new Map();

  const removeBar = id => setExcluding(excluding => ({ ...excluding, [id]: true }));
  const restoreBar = id => setExcluding(excluding => ({ ...excluding, [id]: false }));

  const { subjectHash } = useSubjectsState();
  const subjectIds = subjects.map(s => s._id);

  const { data: newRespData } = useQuery(barCharQuery, { subjectIds, searchChildSubjects: true, publicUserId });
  const graphData = stackGraphData(subjectHash, subjectIds, newRespData);

  useEffect(() => {
    if (elRef.current && graphData && chartIndex > 0) {
      elRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newRespData, subjects]);

  const noResultsRef = el => {
    el && el.scrollIntoView({ behavior: "smooth" });
  };

  const margin = { top: 20, right: 10, bottom: 180, left: 0 };
  const showingDataRaw = graphData?.filter(d => !excluding[d.groupId]);

  const showingData = useMemo(() => {
    showingDataRaw?.forEach((data: any) => {
      data.childSubjects = data.entries.reduce((subjects, { children: theseChildren }) => subjects.concat(theseChildren), []);
    });
    return showingDataRaw as any;
  }, [showingDataRaw]);

  const [hoveredMap, setHoveredMap] = useState({});
  const hoverBar = useCallback(groupId => setHoveredMap(prior => ({ ...prior, [groupId]: true })), []);
  const unHoverBar = useCallback(groupId => setTimeout(() => setHoveredMap(prior => ({ ...prior, [groupId]: false })), 1), []);

  if (!graphData) {
    return null;
  } else if (!graphData.length) {
    return chartIndex == 0 ? (
      <div className="alert alert-warning inline-flex" style={{ marginBottom: "75px" }}>
        It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up here.
      </div>
    ) : (
      <div ref={noResultsRef} className="alert alert-warning" style={{ margin: "0 auto 75px auto" }}>
        It looks like the child subjects under {header} currently have no books assigned
      </div>
    );
  }

  width = Math.min(width, showingData.length * 110 + 60);

  const dataValues = showingData.map(({ count }) => count);
  const displayValues = showingData.map(({ display }) => display);
  const chartHeight = height - margin.top - margin.bottom;
  const dataMax = max(dataValues);
  const dataScale = scaleLinear().domain([0, dataMax]).range([0, chartHeight]);
  const scaleX = scaleBand().domain(displayValues).range([0, width]).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);
  const svgStyle = { display: "block", marginLeft: "auto", marginRight: "auto" }; //, marginLeft: 'auto', marginRight: 'auto'};

  const excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  const offsetY = margin.bottom - height;

  let totalSvgWidth = width;
  const delta = maxWidth - totalSvgWidth;
  let extraOffsetX = 0;
  if (totalSvgWidth < maxWidth) {
    totalSvgWidth = maxWidth;
    extraOffsetX = delta / 2;
  }

  const transform = `scale(1, -1) translate(${margin.left + extraOffsetX}, ${offsetY})`;

  return (
    <div ref={elRef}>
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
        <svg style={svgStyle} width={totalSvgWidth} height={height}>
          <RenderBarChart {...{ showingData, excluding, barMap, scaleX, dataScale, totalSvgWidth, hoverBar, unHoverBar, transform }} />
          <g transform={transform}>
            {showingData
              .filter(d => !excluding[d.groupId])
              .map((d, i) => (
                <SvgTooltip
                  key={d.groupId}
                  data={d}
                  srcHeight={dataScale(d.count)}
                  srcWidth={scaleX.bandwidth()}
                  srcX={scaleX(d.display)}
                  count={showingData.length}
                  index={i}
                  childSubjects={d.childSubjects}
                  hovered={hoveredMap[d.groupId]}
                  {...{ offsetY, drilldown, chartIndex, removeBar }}
                />
              ))}
          </g>
          <Axis
            masterTransform={`translate(${margin.left + extraOffsetX}, ${-1 * margin.bottom})`}
            data={showingData}
            scaleX={scaleX}
            graphWidth={width}
            scale={scaleX}
            transform={`translate(0, ${height})`}
          />
        </svg>
      </div>
      <hr />
    </div>
  );
});

const RenderBarChart = ({ showingData, excluding, barMap, scaleX, dataScale, totalSvgWidth, hoverBar, unHoverBar, transform }) => {
  let animatedGOffsetValues = useSpring({
    config: config.stiff,
    to: { transform }
  });

  return (
    <animated.g {...animatedGOffsetValues}>
      {showingData
        .filter(d => !excluding[d.groupId])
        .map((d, i) => (
          <Bar
            ref={el => barMap.set(d.groupId, el)}
            key={d.groupId}
            data={d}
            count={showingData.length}
            x={scaleX(d.display)}
            y={0}
            width={scaleX.bandwidth()}
            height={dataScale(d.count)}
            totalSvgWidth={totalSvgWidth}
            hoverBar={hoverBar}
            unHoverBar={unHoverBar}
          />
        ))}
    </animated.g>
  );
};

export default BarChart;
