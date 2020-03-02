import React, { createContext, useState, useCallback, useContext } from "react";
import { useSpring, animated, config } from "react-spring";
import BootstrapButton from "app/components/bootstrapButton";
import { useRootSubjects, useChildMapSelector, useSubjectMutations, useSubjectsState } from "app/subjectsState";

import subjectsListStyles from "./subjectsList.module.scss";
import { useColors } from "app/colorsState";
import { EditableExpandableLabelDisplay } from "app/components/labelDisplay";

import EditSubject from "app/components/editSubject";
import Modal from "app/components/modal";

const EditContext = createContext(null);

const { subjectsRoot, subjectRow, contentRoot } = subjectsListStyles;

const SubjectDisplay = props => {
  const { subject } = props;
  const { _id } = subject;

  const childSubjectsMap = useChildMapSelector();
  const childSubjects = childSubjectsMap[subject._id] || [];

  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);

  let classes = `row padding-top padding-bottom ${subjectRow}`;

  const openEditModal = useContext(EditContext);

  return (
    <li key={_id} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div>
        <div className={classes}>
          <EditableExpandableLabelDisplay {...{ childSubjects, expanded, setExpanded }} onEdit={() => openEditModal(subject)} item={subject} />
        </div>
        {editing ? (
          <EditSubject subject={subject} onCancelEdit={() => setEditing(false)} />
        ) : expanded && childSubjects?.length ? (
          <SubjectList subjects={childSubjects} />
        ) : null}
      </div>
    </li>
  );
};

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

  const { opacity } = useSpring({
    config: config.gentle,
    from: { opacity: 0 },
    to: {
      opacity: 1
    },
    onFrame: ({ opacity }) => {
      console.log(opacity);
    },
    onRest() {
      console.log("REST");
    }
  }) as any;

  return (
    <div className={subjectsRoot}>
      <div className="subject-row row subject-row padding-top" style={{ marginBottom: "60px" }}>
        <div className="col-lg-6 col-md-8 col-xs-12">
          <BootstrapButton className="margin-bottom" preset="primary" onClick={() => openEditModal({ name: "" })}>
            New Subject
          </BootstrapButton>

          <EditContext.Provider value={openEditModal}>
            <animated.div style={{ opacity }} className={contentRoot}>
              <SubjectList subjects={topLevelSubjects} />
            </animated.div>
          </EditContext.Provider>
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
