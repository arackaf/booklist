import React, { FunctionComponent, useEffect, useRef, useContext, useState, useMemo, useCallback } from "react";
import { useEditingSubjectHash, usePendingSubjects, useSubjectEditInfo, SubjectType } from "modules/subjects/useSubjectsDndState";
import BootstrapButton from "app/components/bootstrapButton";
import ColorsPalette from "app/components/colorsPalette";
import CustomColorPicker from "app/components/customColorPicker";
import {
  useLevelSubjectsSortedSelector,
  useChildMapSelector,
  useSubjectMutations,
  useSubjectsState,
  getEligibleParents,
  computeSubjectParentId
} from "app/subjectsState";
import { SubjectsDnDContext, useSubjectsDndState } from "./useSubjectsDndState";

import subjectsListStyles from "./subjectsList.module.scss";
import { useColors } from "app/colorsState";
import { LabelDisplay, EditableExpandableLabelDisplay } from "app/components/labelDisplay";
import { useMutation, buildMutation } from "micro-graphql-react";
import { MutationOf, Mutations } from "graphql-typings";

import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";

import cn from "classnames";

const { listGroup, editPane, defaultSubjectDisplay, subjectPreview, textColorSaveBox, subjectRow, showOnHoverParent } = subjectsListStyles;

type subjectDisplayProps = {
  subject: SubjectType & { candidateMove: boolean };
};

const SubjectDisplay = (props => {
  const { subject } = props;
  const { _id, candidateMove } = subject;
  const style: any = {};

  return (
    <li key={_id} style={{ ...style, paddingTop: 0, paddingBottom: 0 }}>
      <SubjectDisplayContent {...{ subject }} />
    </li>
  );
}) as FunctionComponent<subjectDisplayProps>;

const SubjectDisplayContent = props => {
  const { subject } = props;

  const { colors } = useColors();

  const { _id } = subject;
  const { isEditingSubject, isPendingDelete, isDeleting, isSubjectSaving, isSubjectSaved } = useSubjectEditInfo(subject);

  const pendingSubjectsLookup = usePendingSubjects();
  const pendingChildren = pendingSubjectsLookup[subject._id] || [];

  const { editingSubjectsHash: shapedEditingSubjectHash } = useEditingSubjectHash();
  const editingSubject = shapedEditingSubjectHash[_id];

  let childSubjectsMap = useChildMapSelector();
  let childSubjects = childSubjectsMap[subject._id] || [];
  let effectiveChildren = pendingChildren.concat(childSubjects);
  let deleteMessage = childSubjects.length ? "Confirm - child subjects will also be deleted" : "Confirm Delete";

  let classToPass = `row padding-top padding-bottom ${subjectRow}`;
  let defaultDisplayClass = `${classToPass} ${defaultSubjectDisplay}`;
  return (
    <div>
      {isEditingSubject ? null : isDeleting ? ( // <EditingSubjectDisplay subject={subject} isSubjectSaving={isSubjectSaving} editingSubject={editingSubject} colors={colors} />
        <DeletingSubjectDisplay className={classToPass} name={subject.name} />
      ) : isPendingDelete ? (
        <PendingDeleteSubjectDisplay className={classToPass} subject={subject} deleteMessage={deleteMessage} />
      ) : (
        <DefaultSubjectDisplay className={defaultDisplayClass} subject={subject} isSubjectSaving={isSubjectSaving} isSubjectSaved={isSubjectSaved} />
      )}

      {null && effectiveChildren.length ? <SubjectList style={{ marginTop: 0 }} subjects={effectiveChildren} /> : null}
    </div>
  );
};

const DefaultSubjectDisplay = props => {
  const { isSubjectSaving, isSubjectSaved, className, subject } = props;

  const childSubjectsMap = useChildMapSelector();

  const childSubjects = childSubjectsMap[subject._id] || [];

  const { _id, name, backgroundColor, textColor } = subject;
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const mainIcon = isSubjectSaving ? (
    <i className="fa fa-fw fa-spinner fa-spin" />
  ) : isSubjectSaved ? (
    <i style={{ color: "green" }} className="fa fa-fw fa-check" />
  ) : null;

  const [{}, { addNewSubject, beginSubjectDelete }] = useContext(SubjectsDnDContext);

  return (
    <>
      <div className={className}>
        {null && !isSubjectSaving ? (
          <a>
            <i className="fal fa-pencil-alt"></i>
          </a>
        ) : null}
        {null && !isSubjectSaving ? (
          <a onClick={() => addNewSubject(_id)}>
            <i className="fa fa-fw fa-plus" />
          </a>
        ) : null}
        {null && !isSubjectSaving ? (
          <a onClick={() => beginSubjectDelete(_id)} style={{ marginLeft: "20px" }}>
            <i className="fa fa-fw fa-trash" />
          </a>
        ) : null}
        <EditableExpandableLabelDisplay {...{ childSubjects, expanded, setExpanded }} onEdit={() => setEditing(true)} item={subject} />
      </div>
      {editing ? (
        <EditingSubjectDisplay childSubjects={childSubjects} subject={subject} onCancelEdit={() => setEditing(false)} />
      ) : expanded && childSubjects?.length ? (
        <SubjectList style={{ marginTop: 0 }} subjects={childSubjects} />
      ) : null}
    </>
  );
};

const EditingSubjectDisplay = props => {
  const inputEl = useRef(null);
  useEffect(() => inputEl.current.focus(), []);
  const { subjectHash } = useSubjectsState();

  const { runMutation: updateSubject, running: isSubjectSaving } = useMutation<MutationOf<Mutations["updateSubject"]>>(
    buildMutation(UpdateSubjectMutation)
  );
  const [deleteShowing, setDeleteShowing] = useState(false);

  const [{}, { cancelSubjectEdit, saveChanges }] = useContext(SubjectsDnDContext);

  const { colors } = useColors();
  const { subject, onCancelEdit, childSubjects } = props;
  const { _id, name } = subject;

  const [editingSubject, setEditingSubject] = useState(() => ({ ...subject, parentId: computeSubjectParentId(subject.path) }));
  const [missingName, setMissingName] = useState(false);
  const eligibleParents = useMemo(() => getEligibleParents(subjectHash, _id), [_id, subjectHash]);

  const setEditingSubjectField = (prop, value) => {
    if (prop == "name" && value.trim()) {
      setMissingName(false);
    }
    setEditingSubject(sub => ({ ...sub, [prop]: value }));
  };

  const runSave = () => {
    if (!editingSubject.name.trim()) {
      return setMissingName(true);
    }

    let { _id, name, parentId, backgroundColor, textColor } = editingSubject;
    let request = { _id, name, parentId, backgroundColor, textColor };

    Promise.resolve(updateSubject(request)).then(onCancelEdit);
  };

  const subjectEditingKeyDown = evt => {
    let key = evt.keyCode || evt.which;
    if (key == 13) {
      if (!evt.target.value.trim()) {
        setMissingName(true);
      } else {
        let { subject } = props;
        runSave();
      }
    }
  };

  const onStartDelete = () => {};

  const textColors = ["#ffffff", "#000000"];
  const { validationError } = editingSubject;

  return (
    <div className={`row padding-top padding-bottom ${subjectRow} ${editPane}`}>
      {!deleteShowing ? (
        <>
          <div className="col-xs-12 col-lg-6" style={{ overflow: "hidden", paddingRight: "10px" }}>
            <input
              ref={inputEl}
              onKeyDown={subjectEditingKeyDown}
              onChange={(evt: any) => setEditingSubjectField("name", evt.target.value)}
              value={editingSubject.name}
              className={cn("form-control", { ["has-error"]: missingName })}
            />
            {missingName ? (
              <>
                <span style={{ marginTop: "5px", display: "inline-block" }} className="label label-danger">
                  Subjects need names!
                </span>
                <br />
              </>
            ) : null}
            <div
              className="label label-default"
              style={{
                backgroundColor: editingSubject.backgroundColor,
                color: editingSubject.textColor,
                maxWidth: "100%",
                display: "inline-block",
                overflow: "hidden",
                marginTop: "5px"
              }}
            >
              {editingSubject.name.trim() || "<label preview>"}
            </div>
          </div>
          <div className="col-xs-12 col-lg-6 padding-bottom-small">
            <select
              onChange={(evt: any) => setEditingSubjectField("parentId", evt.target.value)}
              value={editingSubject.parentId || ""}
              className="form-control"
            >
              <option value="">No Parent</option>
              {eligibleParents.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-xs-12 col-lg-6">
            <ColorsPalette
              currentColor={editingSubject.backgroundColor}
              colors={colors}
              onColorChosen={color => setEditingSubjectField("backgroundColor", color)}
            />
            <CustomColorPicker
              labelStyle={{ marginLeft: "5px", marginTop: "3px", display: "inline-block" }}
              onColorChosen={color => setEditingSubjectField("backgroundColor", color)}
              currentColor={editingSubject.backgroundColor}
            />
          </div>
          <div className="col-xs-12 col-lg-6">
            <div className={textColorSaveBox}>
              <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField("textColor", color)} />
            </div>
          </div>
          <div className="col-xs-12" style={{ display: "flex", marginTop: "20px" }}>
            <div>
              <BootstrapButton disabled={isSubjectSaving} style={{ marginRight: "10px" }} preset="primary-xs" onClick={runSave}>
                Save <i className={`fa fa-fw ${isSubjectSaving ? "fa-spinner fa-spin" : "fa-save"}`} />
              </BootstrapButton>
              <BootstrapButton disabled={isSubjectSaving} preset="default-xs" onClick={onCancelEdit}>
                Cancel
              </BootstrapButton>
            </div>
            <BootstrapButton disabled={isSubjectSaving} style={{ marginLeft: "auto" }} preset="danger-xs" onClick={() => setDeleteShowing(true)}>
              Delete {name}&nbsp;
              <i className="fa fa-fw fa-trash" />
            </BootstrapButton>
          </div>

          <hr style={{ flex: 1 }} />
        </>
      ) : (
        <div className="col-xs-12" style={{ display: "flex" }}>
          <PendingDeleteSubjectDisplay childSubjects={childSubjects} subject={subject} cancel={() => setDeleteShowing(false)} />
        </div>
      )}
    </div>
  );
};

const PendingDeleteSubjectDisplay = props => {
  const { subject, cancel, childSubjects } = props;
  const { name, _id, backgroundColor, textColor } = subject;

  const { runMutation, running } = useMutation<MutationOf<Mutations["deleteSubject"]>>(buildMutation(DeleteSubjectMutation));
  const deleteIt = () => runMutation({ _id });

  return (
    <div style={{ flex: 1 }}>
      <div>
        <div className="alert alert-danger" style={{ display: "inline-block" }}>
          Delete {name}?{childSubjects?.length ? <strong style={{ marginLeft: "10px" }}>Child subjects will also be deleted!</strong> : null}
        </div>
        <div style={{ marginTop: "20px" }}>
          <BootstrapButton disabled={running} onClick={deleteIt} preset="danger-xs">
            {running ? (
              <span>
                Deleting <i className="fa fa-spinner fa-spin"></i>
              </span>
            ) : (
              "Delete it!"
            )}
          </BootstrapButton>
          <BootstrapButton disabled={running} onClick={cancel} style={{ marginLeft: "20px" }} className="btn btn-xs">
            Cancel
          </BootstrapButton>
        </div>
      </div>
      <hr style={{ flex: 1, borderColor: "var(--danger-4)", marginBottom: 0 }} className="margin-top-med" />
    </div>
  );
};

const DeletingSubjectDisplay = props => {
  let { name, className } = props;
  return (
    <div className={className}>
      <div className="col-xs-12">
        {name}
        <BootstrapButton preset="danger-xs" disabled={true} style={{ marginLeft: "20px" }}>
          Deleting <i className="fa fa-fw fa-spinner fa-spin" />
        </BootstrapButton>
      </div>
    </div>
  );
};

const SubjectList = props => {
  const { style = {} } = props;

  const { subjectHash } = useSubjectsState();
  const { updateSubject: runInsert } = useSubjectMutations();
  const [{}, { setNewParent }] = useContext(SubjectsDnDContext);

  return (
    <ul className={listGroup} style={{ marginBottom: "5px", ...style }}>
      {props.subjects.map(subject => (
        <SubjectDisplay key={subject._id} {...{ setNewParent, subject, subjectHash, runInsert }} />
      ))}
    </ul>
  );
};

const TopSubjectsList = () => {
  const pendingSubjectsLookup = usePendingSubjects();
  let rootPendingSubjects = pendingSubjectsLookup["root"] || [];
  let topLevelSubjects = useLevelSubjectsSortedSelector();
  let allSubjects = [...rootPendingSubjects, ...topLevelSubjects];

  return (
    <div className="standard-module-container">
      <div className="subject-row row subject-row">
        <div className="col-lg-6 col-md-8 col-xs-12">
          <SubjectList subjects={allSubjects} />
        </div>
      </div>
    </div>
  );
};

export default () => {
  let subjectsState = useSubjectsDndState();

  return (
    <SubjectsDnDContext.Provider value={subjectsState}>
      <TopSubjectsList />
      <br />
      <br />
    </SubjectsDnDContext.Provider>
  );
};
