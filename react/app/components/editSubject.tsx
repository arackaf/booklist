import React, { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { useSubjectsState, getEligibleParents, computeSubjectParentId, useChildMapSelector } from "app/subjectsState";
import { useMutation, buildMutation } from "micro-graphql-react";
import { MutationOf, Mutations } from "graphql-typings";

import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import { useColors } from "app/colorsState";
import CustomColorPicker from "./customColorPicker";
import ColorsPalette from "./colorsPalette";

import BootstrapButton from "app/components/bootstrapButton";
import cn from "classnames";

const textColorSaveBoxStyles = {
  display: "flex",
  flexDirection: "row-reverse",
  alignItems: "center"
} as any;

const EditSubject = props => {
  const [deleteShowing, setDeleteShowing] = useState(false);

  const childSubjectsMap = useChildMapSelector();

  const { subject, onCancelEdit, className = "" } = props;
  const childSubjects = childSubjectsMap[subject._id] || [];

  const [editingSubject, setEditingSubject] = useState(null);

  useLayoutEffect(() => {
    setEditingSubject({ ...subject, parentId: computeSubjectParentId(subject.path) });
  }, [subject]);

  if (!editingSubject) {
    return <div className={`row padding-bottom ${className}`}></div>;
  }

  return (
    <div className={`row padding-bottom ${className}`}>
      {!deleteShowing ? (
        <EditSubjectFields {...{ editingSubject, setEditingSubject, onCancelEdit, setDeleteShowing }} />
      ) : (
        <div className="col-xs-12" style={{ display: "flex" }}>
          <PendingDeleteSubjectDisplay
            childSubjects={childSubjects}
            subject={subject}
            onDelete={onCancelEdit}
            cancel={() => setDeleteShowing(false)}
          />
        </div>
      )}
    </div>
  );
};

const PendingDeleteSubjectDisplay = props => {
  const { subject, cancel, childSubjects, onDelete } = props;
  const { name, _id } = subject;

  const { runMutation, running } = useMutation<MutationOf<Mutations["deleteSubject"]>>(buildMutation(DeleteSubjectMutation));
  const deleteIt = () => runMutation({ _id }).then(onDelete);

  return (
    <div style={{ flex: 1 }}>
      <div>
        <div className="alert alert-danger alert-slim" style={{ display: "inline-block" }}>
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
    </div>
  );
};

const EditSubjectFields = props => {
  const { editingSubject, setEditingSubject, onCancelEdit, setDeleteShowing } = props;

  const { subjectHash } = useSubjectsState();
  const { colors } = useColors();

  const { _id, name } = editingSubject;

  const inputEl = useRef(null);
  useEffect(() => inputEl.current.focus(), []);

  const { runMutation: updateSubject, running: isSubjectSaving } = useMutation<MutationOf<Mutations["updateSubject"]>>(
    buildMutation(UpdateSubjectMutation)
  );

  const textColors = ["#ffffff", "#000000"];

  const eligibleParents = useMemo(() => getEligibleParents(subjectHash, _id) || [], [_id, subjectHash]);

  const [missingName, setMissingName] = useState(false);
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
        runSave();
      }
    }
  };

  return (
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
        <div style={textColorSaveBoxStyles}>
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
        {_id ? (
          <BootstrapButton disabled={isSubjectSaving} style={{ marginLeft: "auto" }} preset="danger-xs" onClick={() => setDeleteShowing(true)}>
            Delete {name}&nbsp;
            <i className="fa fa-fw fa-trash" />
          </BootstrapButton>
        ) : null}
      </div>
    </>
  );
};

export default EditSubject;
