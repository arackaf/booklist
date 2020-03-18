import React, { FunctionComponent, useState } from "react";
import BootstrapButton from "app/components/bootstrapButton";

import GenericLabelSelect from "app/components/genericLabelSelect";

import Modal from "app/components/modal";
import { filterSubjects, useStackedSubjects } from "app/subjectsState";

import EditSubject from "app/components/editSubject";
import FlexRow from "app/components/layout/FlexRow";
import FlowItems from "app/components/layout/FlowItems";

interface ILocalProps {
  editModalOpen: boolean;
  stopEditing: any;
}

const SubjectEditModal: FunctionComponent<ILocalProps> = props => {
  const { subjectsUnwound } = useStackedSubjects();
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectSearch, setSubjectSearch] = useState("");

  const newSubject = () => startEditing({ name: "" });
  const editSubject = subject => {
    startEditing(subject);
    setSubjectSearch("");
  };
  const startEditing = subject => setEditingSubject(subject);
  const cancelEdit = () => setEditingSubject(null);

  let searchedSubjects = filterSubjects(subjectsUnwound, subjectSearch);

  return (
    <Modal isOpen={props.editModalOpen} onHide={props.stopEditing} headerCaption="Edit subjects">
      <div className="stack">
        <FlowItems pushLast={true} xsFlowReverse={true}>
          <GenericLabelSelect
            inputProps={{ tabIndex: "-1", placeholder: "Edit subject", value: subjectSearch, onChange: evt => setSubjectSearch(evt.target.value) }}
            suggestions={searchedSubjects}
            onSuggestionSelected={item => editSubject(item)}
          />

          <BootstrapButton onClick={newSubject} style={{ alignSelf: "flex-start" }} preset="info-xs">
            <span className="visible-xs">Add new subject </span>
            <i className="fa fa-fw fa-plus-square" />
          </BootstrapButton>
        </FlowItems>

        {editingSubject ? <EditSubject subject={editingSubject} onCancelEdit={cancelEdit} /> : null}
        <hr />
      </div>
      <BootstrapButton onClick={props.stopEditing}>Close</BootstrapButton>
    </Modal>
  );
};

export default SubjectEditModal;
