import React, { createContext, useState, useCallback, useContext } from "react";
import { useSpring, animated, config } from "react-spring";
import BootstrapButton from "app/components/bootstrapButton";
import { useRootSubjects, useChildMapSelector, useSubjectMutations, useSubjectsState } from "app/subjectsState";

import subjectsListStyles from "./subjectsList.module.scss";
import { useColors } from "app/colorsState";
import { EditableExpandableLabelDisplay } from "app/components/labelDisplay";

import EditSubject from "app/components/editSubject";
import Modal from "app/components/modal";

const AnimationContext = createContext(null);
const EditContext = createContext(null);

const { subjectsRoot, subjectRow, contentRoot } = subjectsListStyles;

const SubjectDisplay = props => {
  const { subject } = props;
  const { _id } = subject;

  const childSubjectsMap = useChildMapSelector();
  const childSubjects = childSubjectsMap[subject._id] || [];

  const [expanded, setExpanded] = useState(true);

  const { height, opacity, transform } = useSpring({
    config: { ...config.molasses },
    from: { height: 0, opacity: 0, transform: "translate3d(40px,0,0)" },
    to: {
      height: expanded ? 100 /*viewHeight*/ : 0,
      opacity: expanded ? 1 : 0,
      transform: `translate3d(${expanded ? 0 : 40}px,0,0)`
    }
  }) as any;

  let classes = `row padding-top padding-bottom ${subjectRow}`;

  const openEditModal = useContext(EditContext);

  return (
    <li key={_id} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div>
        <div className={classes}>
          <EditableExpandableLabelDisplay {...{ childSubjects, expanded, setExpanded }} onEdit={() => openEditModal(subject)} item={subject} />
        </div>
        <SubjectList animatedProps={{ opacity, transform }} subjects={childSubjects} />
      </div>
    </li>
  );
};

const SubjectList = props => {
  const { animatedProps = {} } = props;
  const { subjectHash } = useSubjectsState();
  const { updateSubject: runInsert } = useSubjectMutations();
  const uiReady = useContext(AnimationContext);

  return (
    <animated.ul style={uiReady ? { ...animatedProps } : {}}>
      {props.subjects.map(subject => (
        <SubjectDisplay key={subject._id} {...{ subject, subjectHash, runInsert }} />
      ))}
    </animated.ul>
  );
};

const defaultEditState = {
  editingSubject: { name: "" }
};

export default () => {
  const [subjectEditState, setSubjectEditState] = useState(defaultEditState);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uiReady, setUiReady] = useState(false);
  const { editingSubject } = subjectEditState;

  useColors();
  const topLevelSubjects = useRootSubjects();

  const openEditModal = useCallback(editingSubject => {
    setSubjectEditState({ editingSubject });
    setEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  const { opacity } = useSpring({
    config: { ...config.slow, clamp: true },
    from: { opacity: 0 },
    to: {
      opacity: 1
    },
    onRest: () => setUiReady(true)
  }) as any;

  return (
    <div className={subjectsRoot}>
      <div className="subject-row row subject-row padding-top" style={{ marginBottom: "60px" }}>
        <div className="col-lg-6 col-md-8 col-xs-12">
          <BootstrapButton className="margin-bottom" preset="primary" onClick={() => openEditModal({ name: "" })}>
            New Subject
          </BootstrapButton>

          <AnimationContext.Provider value={uiReady}>
            <EditContext.Provider value={openEditModal}>
              <animated.div style={{ opacity }} className={contentRoot}>
                <SubjectList subjects={topLevelSubjects} />
              </animated.div>
            </EditContext.Provider>
          </AnimationContext.Provider>
        </div>
      </div>

      <Modal className="fade" isOpen={editModalOpen} onHide={closeEditModal} headerCaption={"Edit Subject"}>
        <EditSubject subject={editingSubject} onCancelEdit={closeEditModal} />
        <hr />
        <BootstrapButton onClick={closeEditModal}>Close</BootstrapButton>
      </Modal>
    </div>
  );
};
