import React, { FunctionComponent, useState } from "react";
import BootstrapButton from "app/components/bootstrapButton";

import GenericLabelSelect from "app/components/genericLabelSelect";

import Modal from "app/components/modal";
import { filterSubjects, useStackedSubjects } from "app/subjectsState";

import EditSubject from "app/components/editSubject";

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
      <div className="visible-xs">
        <BootstrapButton onClick={newSubject} preset="info-xs">
          Add new subject <i className="fa fa-fw fa-plus" />
        </BootstrapButton>
        <br />
        <br />
      </div>
      <div className="row">
        <div className="col-xs-11">
          <GenericLabelSelect
            inputProps={{ tabIndex: "-1", placeholder: "Edit subject", value: subjectSearch, onChange: evt => setSubjectSearch(evt.target.value) }}
            suggestions={searchedSubjects}
            onSuggestionSelected={item => editSubject(item)}
          />
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <BootstrapButton className="hidden-xs" onClick={newSubject} preset="info-xs">
            <i className="fa fa-fw fa-plus-square" />
          </BootstrapButton>
        </div>
      </div>

      <br />

      {editingSubject ? <EditSubject subject={editingSubject} onCancelEdit={cancelEdit} /> : null}
      <hr />
      <BootstrapButton onClick={props.stopEditing}>Close</BootstrapButton>
    </Modal>
  );
};

export default SubjectEditModal;
