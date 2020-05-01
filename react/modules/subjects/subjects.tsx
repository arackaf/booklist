import React, { memo, useState, FC, useRef } from "react";
import { useSpring, animated, config } from "react-spring";

import "./subjectsList.scss";
import { useColors } from "app/state/colorsState";

import { useHeight, usePrevious } from "app/animationHelpers";

import cn from "classnames";

const EditableExpandableLabelDisplay = props => {
  let { item, expanded, setExpanded, childSubjects = [] } = props;
  let extraStyles = props.style || {};
  let extraClasses = props.className || "";

  return (
    <span
      style={{ backgroundColor: item.backgroundColor, color: item.textColor || "white", ...extraStyles }}
      className={"label label-default label-editable-expandable noselect " + extraClasses}
    >
      {childSubjects?.length ? (
        <a
          className={cn("toggle", { expanded })}
          onClick={() => setExpanded(val => !val)}
          style={{ color: item.textColor || "white", borderRight: `1px solid ${item.textColor || "white"}` }}
        >
          <i className="fad fa-chevron-right"></i>
        </a>
      ) : null}

      {props.children || item.name}
    </span>
  );
};

const SubjectDisplay: FC<any> = memo(props => {
  const { subject } = props;
  const { _id, childSubjects = [] } = subject;

  const uiReady = useRef(false);

  const [expanded, setExpanded] = useState(true);
  const previous = usePrevious(expanded);

  const [resizeRef, viewHeight] = useHeight();
  const { height, opacity, transform } = useSpring({
    immediate: !uiReady.current,
    config: expanded ? { ...config.stiff } : { mass: 1, tension: 300, friction: 30, clamp: true },
    from: { height: 0, opacity: 0, transform: "translate3d(20px,-20px,0)" },
    to: {
      height: expanded ? viewHeight : 0,
      opacity: expanded ? 1 : 0,
      transform: `translate3d(${expanded ? 0 : 20}px,${expanded ? 0 : -20}px,0)`
    },
    onRest: () => (uiReady.current = true)
  }) as any;

  let classes = `padding-bottom-med subjectRow`;

  return (
    <animated.li key={_id} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div>
        <div className={classes}>
          <EditableExpandableLabelDisplay {...{ childSubjects, expanded, setExpanded }} item={subject} />
        </div>
        <animated.div style={{ height: expanded && previous ? "auto" : height }}>
          <animated.div ref={resizeRef} style={{ opacity, transform }}>
            <SubjectList subjects={childSubjects} />
          </animated.div>
        </animated.div>
      </div>
    </animated.li>
  );
});

const SubjectList = props => {
  return (
    <ul>
      {props.subjects.map(subject => (
        <SubjectDisplay key={subject._id} subject={subject} />
      ))}
    </ul>
  );
};

export default () => {
  useColors();
  const topLevelSubjects = [
    {
      _id: 1,
      name: "Documents",
      backgroundColor: "gray",
      textColor: "white",
      childSubjects: [
        { _id: "1a", name: "financial planning", backgroundColor: "aquamarine", textColor: "black" },
        { _id: "1b", name: "taxes", backgroundColor: "beige", textColor: "black" },
        { _id: "1c", name: "definitely not porn", backgroundColor: "red", textColor: "white" },
        {
          _id: "1d",
          name: "images",
          backgroundColor: "green",
          textColor: "white",
          childSubjects: [
            { _id: "1d i", name: "katie", backgroundColor: "black", textColor: "white" },
            { _id: "1d ii", name: "disney", backgroundColor: "magenta", textColor: "white" },
            { _id: "1d iii", name: "key west", backgroundColor: "pink", textColor: "black" }
          ]
        }
      ]
    },
    {
      _id: 2,
      name: "git",
      backgroundColor: "purple",
      textColor: "white",
      childSubjects: [
        {
          _id: "2a",
          name: "micro-graphql-react",
          backgroundColor: "blueViolet",
          textColor: "white",
          childSubjects: [
            { _id: "2a i", name: "src", backgroundColor: "burlywood", textColor: "black" },
            { _id: "2a ii", name: "dist", backgroundColor: "coral", textColor: "black" },
            { _id: "2a iii", name: "docs", backgroundColor: "pudarkcyan", textColor: "white" }
          ]
        },
        {
          _id: "2b",
          name: "mongo-graphql-starter",
          backgroundColor: "cadetblue",
          textColor: "white",
          childSubjects: [
            { _id: "2b i", name: "src", backgroundColor: "cornsilk", textColor: "black" },
            { _id: "2b ii", name: "dist", backgroundColor: "darkkhaki", textColor: "black" },
            { _id: "2b iii", name: "docs", backgroundColor: "darkorange", textColor: "white" }
          ]
        }
      ]
    },
    {
      _id: 3,
      name: "Dropbox",
      backgroundColor: "gold",
      textColor: "black"
    }
  ];

  const { opacity } = useSpring({
    config: { ...config.slow },
    from: { opacity: 0 },
    to: {
      opacity: 1
    }
  }) as any;

  return (
    <div className="subjectsRoot">
      <animated.div style={{ opacity }} className="contentRoot">
        <SubjectList subjects={topLevelSubjects} />
      </animated.div>
    </div>
  );
};
