import React, { memo, createContext, useState, useCallback, useContext, FC, useRef } from "react";
import { useSpring, animated, config } from "react-spring";
import { Button } from "app/components/ui/Button";
import { useRootSubjects, useChildMapSelector, useSubjectMutations, useSubjectsState } from "app/state/subjectsState";

import subjectsListStyles from "./subjectsList.module.scss";
import { useColors } from "app/state/colorsState";
import { EditableExpandableLabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import EditSubject from "app/components/subjectsAndTags/subjects/EditSubject";
import Modal from "app/components/ui/Modal";
import { useHeight, usePrevious } from "app/animationHelpers";
import FlexRow from "app/components/layout/FlexRow";

const AnimationContext = createContext(null);
const EditContext = createContext(null);

const { subjectsRoot, subjectRow, contentRoot } = subjectsListStyles;

const SubjectDisplay: FC<any> = memo(props => {
  const { subject } = props;
  const { _id } = subject;

  const uiReady = useRef(false);

  const childSubjectsMap = useChildMapSelector();
  const childSubjects = childSubjectsMap[subject._id] || [];

  const [expanded, setExpanded] = useState(true);
  const previous = usePrevious(expanded);

  const [resizeRef, viewHeight] = useHeight();
  const styles = useSpring({
    immediate: !uiReady.current,
    config: expanded ? { ...config.stiff, clamp: false } : { mass: 1, tension: 300, friction: 30, clamp: true },
    from: { height: 0, opacity: 0, transform: "translate3d(20px,-20px,0)" },
    to: {
      height: expanded ? viewHeight : 0,
      opacity: expanded ? 1 : 0,
      transform: `translate3d(${expanded ? 0 : 20}px,${expanded ? 0 : -20}px,0)`
    },
    onRest: () => (uiReady.current = true)
  }) as any;
  const { height, opacity, transform } = styles || {};

  let classes = `padding-bottom-med ${subjectRow}`;

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

const defaultEditState = {
  editingSubject: { name: "" }
};

export default () => {
  const [subjectEditState, setSubjectEditState] = useState(defaultEditState);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { editingSubject } = subjectEditState;

  useColors();
  const topLevelSubjects = useRootSubjects();

  const openEditModal = useCallback(editingSubject => {
    setSubjectEditState({ editingSubject });
    setEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  const styles = useSpring({
    config: { ...config.slow },
    from: { opacity: 0 },
    to: {
      opacity: 1
    }
  }) as any;

  return (
    <div className={`standard-module-container ${subjectsRoot}`}>
      <div style={{ marginBottom: "60px" }}>
        <FlexRow>
          <div className="col-lg-6 col-md-8 col-xs-12">
            <Button className="margin-bottom" preset="primary" onClick={() => openEditModal({ name: "" })}>
              New Subject
            </Button>

            <EditContext.Provider value={openEditModal}>
              <animated.div style={styles} className={contentRoot}>
                <SubjectList subjects={topLevelSubjects} />
              </animated.div>
            </EditContext.Provider>
          </div>
        </FlexRow>
      </div>

      <Modal className="fade" isOpen={editModalOpen} onHide={closeEditModal} headerCaption={"Edit Subject"}>
        <EditSubject subject={editingSubject} onCancelEdit={closeEditModal} />
        <hr />
        <Button onClick={closeEditModal}>Close</Button>
      </Modal>
    </div>
  );
};
