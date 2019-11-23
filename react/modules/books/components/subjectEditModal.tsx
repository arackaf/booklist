import React, { FunctionComponent, useMemo, useState } from "react";
import BootstrapButton, { AjaxButton } from "app/components/bootstrapButton";
import CustomColorPicker from "app/components/customColorPicker";
import GenericLabelSelect from "app/components/genericLabelSelect";
import ColorsPalette from "app/components/colorsPalette";
import Modal from "app/components/modal";
import {
  filterSubjects,
  getEligibleParents,
  useStackedSubjects,
  computeSubjectParentId,
  useSubjectMutations,
  useSubjectsState
} from "app/subjectsState";
import { useColors } from "app/colorsState";

const SubjectDeletingInfo = props => {
  let deleteWarning = `${props.subjectName} has ${props.affectedChildren} ${
    props.affectedChildren > 1 ? "descendant subjects" : "child subject"
  } which will also be deleted.`;

  return (
    <div className="row">
      <div className="col-xs-12">
        <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>Delete subject {props.subjectName}</h4>

        {props.affectedChildren ? (
          <div style={{ fontSize: "14px" }} className="alter alter-warning">
            {deleteWarning}
          </div>
        ) : null}

        <div style={{ marginTop: "5px", display: "flex" }}>
          <AjaxButton runningText="Deleting" finishedText="Deleted" onClick={() => props.deleteSubject(props._id)} preset="danger-xs">
            Delete
          </AjaxButton>
          <BootstrapButton onClick={props.cancelDeleteSubject} style={{ marginLeft: "auto" }} preset="default-xs">
            Cancel
          </BootstrapButton>
        </div>
        <hr />
      </div>
    </div>
  );
};

interface ILocalProps {
  editModalOpen: boolean;
  stopEditing: any;
}

const useEligibleParents = editingSubject => {
  const { subjectHash } = useSubjectsState();

  return useMemo(() => (editingSubject ? getEligibleParents(subjectHash, editingSubject._id) : []), [subjectHash, editingSubject]);
};

const SubjectEditModal: FunctionComponent<ILocalProps> = props => {
  const { subjectHash } = useSubjectsState();
  const { updateSubject, deleteSubject } = useSubjectMutations();

  const { subjectsUnwound } = useStackedSubjects();
  const { colors } = useColors();
  const [editingSubject, setEditingSubject] = useState(null);

  const [editingSubjectName, setEditingSubjectName] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [parentId, setParentId] = useState("");
  const [affectedChildren, setAffectedChildren] = useState(null);

  const newSubject = () => startEditing({ _id: "", name: "", backgroundColor: "", textColor: "" }, "");
  const editSubject = subject => {
    startEditing(subject, computeSubjectParentId(subject.path));
    setSubjectSearch("");
  };
  const startEditing = (subject, parentId) => {
    setEditingSubject(subject);
    setEditingSubjectName(subject.name);
    setParentId(parentId);
    setDeletingId("");
  };
  const cancelSubjectEdit = () => {
    setEditingSubject(null);
    setDeletingId("");
    setAffectedChildren(null);
  };
  const startDeletingSubject = () => {
    const childSubjectRegex = new RegExp(`.*,${editingSubject._id},.*`);
    const affectedChildren = Object.keys(subjectHash).filter(k => childSubjectRegex.test(subjectHash[k].path)).length;

    setDeletingId(editingSubject._id);
    setAffectedChildren(affectedChildren);
  };

  const setNewSubjectName = value => setEditingValue("name", value);
  const setNewSubjectParent = value => setParentId(value);
  const setNewSubjectBackgroundColor = value => setEditingValue("backgroundColor", value);
  const setNewSubjectTextColor = value => setEditingValue("textColor", value);
  const setEditingValue = (name, value) => setEditingSubject({ ...editingSubject, [name]: value });

  const save = () =>
    Promise.resolve(updateSubject({ ...editingSubject, parentId: parentId })).then(() => {
      cancelSubjectEdit();
      setSubjectSearch("");
    });
  const runDelete = () => {
    setDeleting(true);
    Promise.resolve(deleteSubject({ _id: deletingId })).then(() => {
      setDeleting(false);
      cancelSubjectEdit();
    });
  };

  let eligibleParents = useEligibleParents(editingSubject);
  let textColors = ["#ffffff", "#000000"];
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

      {editingSubject ? (
        <div className="panel panel-info">
          <div className="panel-heading">
            {editingSubject && editingSubject._id ? `Edit ${editingSubject.name}` : "New Subject"}
            {editingSubject && editingSubject._id ? (
              <BootstrapButton onClick={startDeletingSubject} preset="danger-xs" style={{ marginLeft: "auto" }}>
                <i className="fa fa-fw fa-trash" />
              </BootstrapButton>
            ) : null}
          </div>
          <div className="panel-body">
            <div>
              {deletingId ? (
                <SubjectDeletingInfo
                  deleting={deleting}
                  cancelDeleteSubject={() => setDeletingId("")}
                  affectedChildren={affectedChildren}
                  subjectName={editingSubjectName}
                  deleteSubject={runDelete}
                />
              ) : null}

              <div className="row">
                <div className="col-xs-6">
                  <div className="form-group">
                    <label>Subject name</label>
                    <input className="form-control" value={editingSubject.name} onChange={e => setNewSubjectName(e.target.value)} />
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="form-group">
                    <label>Parent</label>
                    <select className="form-control" value={parentId} onChange={(e: any) => setNewSubjectParent(e.target.value)}>
                      <option value="">None</option>
                      {eligibleParents.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-xs-9">
                  <div className="form-group">
                    <label>Label color</label>

                    <ColorsPalette currentColor={editingSubject.backgroundColor} colors={colors} onColorChosen={setNewSubjectBackgroundColor} />
                    <CustomColorPicker
                      labelStyle={{ marginLeft: "5px", marginTop: "3px", display: "inline-block" }}
                      onColorChosen={setNewSubjectBackgroundColor}
                      currentColor={editingSubject.backgroundColor}
                    />
                  </div>
                </div>
                <div className="col-xs-3">
                  <div className="form-group">
                    <label>Text color</label>

                    <ColorsPalette colors={textColors} onColorChosen={setNewSubjectTextColor} />
                  </div>
                </div>
                <div className="col-xs-12">
                  <div style={{ marginTop: "10px" }} className="form-group">
                    <label>Preview &nbsp;&nbsp;</label>
                    <div className="label label-default" style={{ backgroundColor: editingSubject.backgroundColor, color: editingSubject.textColor }}>
                      {editingSubject.name}
                    </div>
                  </div>
                </div>
              </div>
              <br style={{ clear: "both" }} />

              <div style={{ display: "flex" }}>
                <AjaxButton className="btn btn-primary" runningText="Saving" finishedText="Saved" onClick={save}>
                  Save
                </AjaxButton>
                <button className="btn btn-default" onClick={cancelSubjectEdit} style={{ marginLeft: "auto" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <hr />
      <BootstrapButton onClick={props.stopEditing}>Close</BootstrapButton>
    </Modal>
  );
};

export default SubjectEditModal;
