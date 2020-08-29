import React, { FunctionComponent, useState } from "react";
import {Button} from "app/components/ui/Button";

import Modal from "app/components/ui/Modal";

import EditSubject from "app/components/subjectsAndTags/subjects/EditSubject";
import FlowItems from "app/components/layout/FlowItems";
import Stack from "app/components/layout/Stack";
import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects";

interface ILocalProps {
  editModalOpen: boolean;
  stopEditing: any;
}

const SubjectEditModal: FunctionComponent<ILocalProps> = props => {
  const [editingSubject, setEditingSubject] = useState(null);

  const newSubject = () => startEditing({ name: "" });
  const editSubject = subject => {
    startEditing(subject);
  };
  const startEditing = subject => setEditingSubject(subject);
  const cancelEdit = () => setEditingSubject(null);

  return (
    <Modal isOpen={props.editModalOpen} onHide={props.stopEditing} headerCaption="Edit Subjects">
      <Stack>
        <FlowItems pushLast={true} xsFlowReverse={true}>
          <SelectAvailableSubjects placeholder="Edit subject" currentlySelected={[]} onSelect={item => editSubject(item)} />

          <Button onClick={newSubject} preset="info-xs">
            <span className="visible-xs">Add new subject </span>
            <i className="fa fa-fw fa-plus-square" />
          </Button>
        </FlowItems>

        {editingSubject ? <EditSubject subject={editingSubject} onCancelEdit={cancelEdit} /> : null}
        <hr />
      </Stack>
      <Button onClick={props.stopEditing}>Close</Button>
    </Modal>
  );
};

export default SubjectEditModal;
