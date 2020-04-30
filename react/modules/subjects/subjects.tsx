import React, { memo, createContext, useState, useContext, FC, useRef } from "react";
import { useSpring, animated, config } from "react-spring";
import { useRootSubjects, useChildMapSelector, useSubjectMutations, useSubjectsState } from "app/state/subjectsState";

import "./subjectsList.scss";
import { useColors } from "app/state/colorsState";
import { EditableExpandableLabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { useHeight, usePrevious } from "app/animationHelpers";

const EditContext = createContext(null);

const SubjectDisplay: FC<any> = memo(props => {
  const { subject } = props;
  const { _id } = subject;

  const uiReady = useRef(false);

  const childSubjectsMap = useChildMapSelector();
  const childSubjects = childSubjectsMap[subject._id] || [];

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

  const openEditModal = useContext(EditContext);

  return (
    <animated.li key={_id} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div>
        <div className={classes}>
          <EditableExpandableLabelDisplay {...{ childSubjects, expanded, setExpanded }} onEdit={() => openEditModal(subject)} item={subject} />
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
  const { subjectHash } = useSubjectsState();
  const { updateSubject: runInsert } = useSubjectMutations();

  return (
    <ul>
      {props.subjects.map(subject => (
        <SubjectDisplay key={subject._id} {...{ subject, subjectHash, runInsert }} />
      ))}
    </ul>
  );
};

export default () => {
  useColors();
  const topLevelSubjects = useRootSubjects();

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
