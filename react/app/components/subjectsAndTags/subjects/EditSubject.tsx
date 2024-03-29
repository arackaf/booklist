import React, { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { useSubjectsState, getEligibleParents, computeSubjectParentId, useChildMapSelector } from "app/state/subjectsState";
import { useMutation } from "micro-graphql-react";
import { MutationOf, Mutations } from "gql/graphql-typings";

import UpdateSubjectMutation from "gql/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "gql/subjects/deleteSubject.graphql";
import { useColors } from "app/state/colorsState";
import CustomColorPicker from "../../ui/CustomColorPicker";
import ColorsPalette from "../../ui/ColorsPalette";

import cn from "classnames";
import FlexRow from "../../layout/FlexRow";
import FlowItems from "../../layout/FlowItems";
import Stack from "../../layout/Stack";
import { Button } from "../../ui/Button";

const EditSubject = props => {
  const [deleteShowing, setDeleteShowing] = useState(false);

  const childSubjectsMap = useChildMapSelector();

  const { subject, onCancelEdit } = props;
  const childSubjects = childSubjectsMap[subject._id] || [];

  const [editingSubject, setEditingSubject] = useState(null);

  useLayoutEffect(() => {
    setEditingSubject({ ...subject, parentId: computeSubjectParentId(subject.path) });
    setDeleteShowing(false);
  }, [subject]);

  if (!editingSubject) {
    return <div></div>;
  }

  return (
    <FlexRow>
      {!deleteShowing ? (
        <EditSubjectFields {...{ editingSubject, setEditingSubject, onCancelEdit, setDeleteShowing }} />
      ) : (
        <div className="col-xs-12">
          <PendingDeleteSubjectDisplay
            childSubjects={childSubjects}
            subject={subject}
            onDelete={onCancelEdit}
            cancel={() => setDeleteShowing(false)}
          />
        </div>
      )}
    </FlexRow>
  );
};

const PendingDeleteSubjectDisplay = props => {
  const { subject, cancel, childSubjects, onDelete } = props;
  const { name, _id } = subject;

  const { runMutation, running } = useMutation<MutationOf<Mutations["deleteSubject"]>>(DeleteSubjectMutation);
  const deleteIt = () => runMutation({ _id }).then(onDelete);

  return (
    <Stack>
      <div className="alert alert-danger alert-slim" style={{ alignSelf: "flex-start" }}>
        <FlowItems tighter={true}>
          <span>Delete {name}?</span>
          {childSubjects?.length ? <strong>Child subjects will also be deleted!</strong> : null}
        </FlowItems>
      </div>
      <FlowItems>
        <Button disabled={running} onClick={deleteIt} preset="danger-xs">
          {running ? (
            <span>
              Deleting <i className="far fa-spinner fa-spin"></i>
            </span>
          ) : (
            "Delete it!"
          )}
        </Button>
        <Button disabled={running} onClick={cancel} className="btn btn-xs">
          Cancel
        </Button>
      </FlowItems>
    </Stack>
  );
};

const EditSubjectFields = props => {
  const { editingSubject, setEditingSubject, onCancelEdit, setDeleteShowing } = props;

  const { subjectHash } = useSubjectsState();
  const { colors } = useColors();

  const { _id, name } = editingSubject;

  const inputEl = useRef(null);
  useEffect(() => inputEl.current.focus({ preventScroll: true }), []);

  const { runMutation: updateSubject, running: isSubjectSaving } = useMutation<MutationOf<Mutations["updateSubject"]>>(UpdateSubjectMutation);

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
    <FlexRow>
      <div className="col-xs-12 col-lg-6">
        <div className="form-group">
          <label>Name</label>
          <input
            ref={inputEl}
            onKeyDown={subjectEditingKeyDown}
            onChange={(evt: any) => setEditingSubjectField("name", evt.target.value)}
            value={editingSubject.name}
            className={cn("form-control", { error: missingName })}
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
              overflow: "hidden",
              alignSelf: "flex-start"
            }}
          >
            {editingSubject.name.trim() || "<label preview>"}
          </div>
        </div>
      </div>
      <div className="col-xs-12 col-lg-6">
        <div className="form-group">
          <label>Parent</label>
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
      </div>
      <div className="col-xs-12 col-sm-6">
        <div className="form-group">
          <label>Label Color</label>
          <ColorsPalette
            currentColor={editingSubject.backgroundColor}
            colors={colors}
            onColorChosen={color => setEditingSubjectField("backgroundColor", color)}
          />
          <CustomColorPicker
            labelStyle={{ marginLeft: "3px" }}
            onColorChosen={color => setEditingSubjectField("backgroundColor", color)}
            currentColor={editingSubject.backgroundColor}
          />
        </div>
      </div>
      <div className="col-xs-12 col-sm-6">
        <div className="form-group">
          <label>Text Color</label>
          <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField("textColor", color)} />
          <CustomColorPicker
            labelStyle={{ marginLeft: "3px" }}
            onColorChosen={color => setEditingSubjectField("textColor", color)}
            currentColor={editingSubject.backgroundColor}
          />
        </div>
      </div>
      <div className="col-xs-12">
        <FlowItems pushLast={true}>
          <Button disabled={isSubjectSaving} preset="primary-xs" onClick={runSave}>
            Save <i className={`far fa-fw ${isSubjectSaving ? "fa-spinner fa-spin" : "fa-save"}`} />
          </Button>
          <Button disabled={isSubjectSaving} preset="default-xs" onClick={onCancelEdit}>
            Cancel
          </Button>
          {_id ? (
            <Button disabled={isSubjectSaving} preset="danger-xs" onClick={() => setDeleteShowing(true)}>
              Delete {name} <i className="far fa-fw fa-trash" />
            </Button>
          ) : null}
        </FlowItems>
      </div>
    </FlexRow>
  );
};

export default EditSubject;
