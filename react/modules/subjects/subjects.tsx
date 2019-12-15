import React, { CSSProperties, FunctionComponent, useLayoutEffect, useEffect, useRef, useContext } from "react";
import { useEditingSubjectHash, usePendingSubjects, useDraggingSubject, useSubjectEditInfo, SubjectType } from "modules/subjects/useSubjectsDndState";
import { DragSource, DragDropContext, DropTarget, DragLayer } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import BootstrapButton from "app/components/bootstrapButton";
import ColorsPalette from "app/components/colorsPalette";
import CustomColorPicker from "app/components/customColorPicker";
import { useLevelSubjectsSortedSelector, useChildMapSelector, useSubjectMutations, useSubjectsState } from "app/subjectsState";
import { SubjectsDnDContext, useSubjectsDndState } from "./useSubjectsDndState";

import subjectsListStyles from "./subjectsList.module.css";
import { useColors } from "app/colorsState";
import { AppContext } from "app/renderUI";

const {
  listGroup,
  editPane,
  defaultSubjectDisplay,
  subjectPreview,
  textColorSaveBox,
  subjectRow,
  showOnHoverParent,
  showOnHoverInline
} = subjectsListStyles;

type dragLayerType = {
  item: any;
  currentOffset: { x: number; y: number };
  isDragging: boolean;
};

const SubjectDragLayer: FunctionComponent<{ currentlyDragging: string } & dragLayerType> = DragLayer((monitor, x) => {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
})((props => {
  const [{ draggingId: currentlyDragging }] = useContext(SubjectsDnDContext);

  const { isDragging, currentOffset, item } = props;
  if (!currentOffset || !item || !currentlyDragging || !isDragging) return null;
  const { x, y } = currentOffset;

  const parentStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  };
  const itemTransform = `translate(${x}px, ${y}px)`;

  return isDragging ? (
    <div style={parentStyles}>
      <div style={{ transform: itemTransform }}>
        <h3>{item.name}</h3>
      </div>
    </div>
  ) : null;
}) as FunctionComponent<{ currentlyDragging: string } & dragLayerType>);

type dropTargetType = {
  connectDropTarget: any;
  isOver: boolean;
  canDrop: boolean;
};

type subjectDisplayProps = {
  subject: SubjectType & { candidateMove: boolean };
  noDrop: boolean;
};

const SubjectDisplay = DropTarget(
  "subject",
  {
    canDrop(props, monitor) {
      let sourceSubject = monitor.getItem();
      let { subject: targetSubject } = props as any;
      let isCurrentParent = sourceSubject.path && new RegExp(`,${targetSubject._id},$`).test(sourceSubject.path);

      return (
        sourceSubject._id != targetSubject._id &&
        !targetSubject.pending &&
        !isCurrentParent &&
        monitor.isOver() &&
        (targetSubject.path || "").indexOf(sourceSubject._id) < 0
      );
    },
    drop(props: any, monitor) {
      let { subject: targetSubject } = props,
        sourceSubject = monitor.getItem();

      props.setNewParent(sourceSubject, targetSubject, props.subjectHash, props.runInsert);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)((props => {
  const { subject, connectDropTarget } = props;
  const isOver = props.isOver && props.canDrop;
  const { _id, candidateMove } = subject;
  const style: any = {};
  const noDrop = candidateMove || props.noDrop;
  const [{}, { subjectDraggingOver, subjectNotDraggingOver, beginDrag, clearSubjectDragging }] = useContext(SubjectsDnDContext);

  useLayoutEffect(() => {
    if (isOver) {
      subjectDraggingOver(_id);
    } else {
      subjectNotDraggingOver(_id);
    }
  }, [isOver]);

  return (
    <li key={_id} style={{ ...style, paddingTop: 0, paddingBottom: 0 }}>
      <SubjectDisplayContent connectDropTarget={connectDropTarget} {...{ noDrop, subject, beginDrag, clearSubjectDragging }} />
    </li>
  );
}) as FunctionComponent<subjectDisplayProps & dropTargetType>);

const SubjectDisplayContent = DragSource(
  "subject",
  {
    beginDrag: (props: any) => {
      props.beginDrag(props.subject._id);
      return props.subject;
    },
    endDrag: props => {
      props.clearSubjectDragging();
    }
  },
  connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  })
)(props => {
  const { subject, connectDragSource, connectDragPreview, noDrop, connectDropTarget } = props;

  const { colors } = useColors();

  const { _id } = subject;
  const [{ currentDropCandidateId }] = useContext(SubjectsDnDContext);
  const { isEditingSubject, isPendingDelete, isDeleting, isSubjectSaving, isSubjectSaved } = useSubjectEditInfo(subject);

  const pendingSubjectsLookup = usePendingSubjects();
  const draggingSubject = useDraggingSubject();
  const dropCandidateSubject = currentDropCandidateId == _id ? draggingSubject : null;
  const pendingChildren = pendingSubjectsLookup[subject._id] || [];

  const { editingSubjectsHash: shapedEditingSubjectHash } = useEditingSubjectHash();
  const editingSubject = shapedEditingSubjectHash[_id];

  let childSubjectsMap = useChildMapSelector();
  let childSubjects = childSubjectsMap[subject._id] || [];
  let effectiveChildren = pendingChildren.concat(childSubjects);
  let deleteMessage = childSubjects.length ? "Confirm - child subjects will also be deleted" : "Confirm Delete";

  if (dropCandidateSubject) {
    effectiveChildren.unshift(dropCandidateSubject as any);
  }

  let classToPass = `row padding-top padding-bottom ${subjectRow}`;
  return connectDragPreview(
    <div>
      {isEditingSubject ? (
        <EditingSubjectDisplay
          className={classToPass}
          subject={subject}
          isSubjectSaving={isSubjectSaving}
          editingSubject={editingSubject}
          colors={colors}
        />
      ) : isDeleting ? (
        <DeletingSubjectDisplay className={classToPass} name={subject.name} />
      ) : isPendingDelete ? (
        <PendingDeleteSubjectDisplay className={classToPass} subject={subject} deleteMessage={deleteMessage} />
      ) : (
        <DefaultSubjectDisplay
          className={classToPass}
          subject={subject}
          connectDragSource={connectDragSource}
          connectDropTarget={connectDropTarget}
          noDrop={noDrop}
          isSubjectSaving={isSubjectSaving}
          isSubjectSaved={isSubjectSaved}
        />
      )}

      {effectiveChildren.length ? <SubjectList noDrop={noDrop} style={{ marginTop: 0 }} subjects={effectiveChildren} /> : null}
    </div>
  );
});

const DefaultSubjectDisplay = props => {
  const [{ online, isTouch }] = useContext(AppContext);
  const { connectDropTarget, connectDragSource, isSubjectSaving, isSubjectSaved, className, subject, noDrop } = props;

  const { _id, name, backgroundColor, textColor } = subject;
  const mainIcon = isSubjectSaving ? (
    <i className="fa fa-fw fa-spinner fa-spin" />
  ) : isSubjectSaved ? (
    <i style={{ color: "green" }} className="fa fa-fw fa-check" />
  ) : isTouch || !online ? null : (
    connectDragSource(<i className="fa fa-fw fa-arrows drag-handle" />)
  );

  const { subjectHash } = useSubjectsState();
  const [{}, { beginSubjectEdit, addNewSubject, beginSubjectDelete }] = useContext(SubjectsDnDContext);

  return (noDrop ? c => c : connectDropTarget)(
    <div className={className}>
      <div
        className={`col-xs-12 ${showOnHoverParent} ${defaultSubjectDisplay}`}
        style={{ backgroundColor: backgroundColor || "var(--neutral-text)", color: textColor || "white" }}
      >
        {mainIcon}
        &nbsp;
        <div className={subjectPreview}>{name || "<label preview>"}</div>
        {!isSubjectSaving ? (
          <a className={showOnHoverInline} onClick={() => beginSubjectEdit(_id, subjectHash)}>
            <i className="fa fa-fw fa-pencil" />
          </a>
        ) : null}
        {!isSubjectSaving ? (
          <a className={showOnHoverInline} onClick={() => addNewSubject(_id)}>
            <i className="fa fa-fw fa-plus" />
          </a>
        ) : null}
        {!isSubjectSaving ? (
          <a className={showOnHoverInline} onClick={() => beginSubjectDelete(_id)} style={{ marginLeft: "20px" }}>
            <i className="fa fa-fw fa-trash" />
          </a>
        ) : null}
      </div>
    </div>
  );
};

const EditingSubjectDisplay = props => {
  const inputEl = useRef(null);
  useEffect(() => inputEl.current.focus(), []);
  const { subjectHash } = useSubjectsState();
  const { updateSubject } = useSubjectMutations();
  const [{}, { cancelSubjectEdit, setEditingSubjectField, saveChanges }] = useContext(SubjectsDnDContext);

  const subjectEditingKeyDown = evt => {
    let key = evt.keyCode || evt.which;
    if (key == 13) {
      let { subject, editingSubject } = props;
      saveChanges(editingSubject, subject, subjectHash, updateSubject);
    }
  };

  const { isSubjectSaving, className, subject, editingSubject, colors } = props;
  const { _id, name } = subject;
  const textColors = ["#ffffff", "#000000"];
  const { validationError } = editingSubject;

  return (
    <div className={className + ` ${editPane}`}>
      <div className="col-xs-12 col-lg-6" style={{ overflow: "hidden", paddingRight: "10px" }}>
        <input
          ref={inputEl}
          onKeyDown={subjectEditingKeyDown}
          onChange={(evt: any) => setEditingSubjectField(_id, "name", evt.target.value)}
          value={editingSubject.name}
          className="form-control"
        />
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
          {editingSubject.name || "<label preview>"}
        </div>
        {subject.pending ? <br /> : null}
        {subject.pending ? (
          <span className="label label-warning" style={{ marginTop: "5px", display: "inline-block" }}>
            This subject is not saved
          </span>
        ) : null}
        {validationError ? <br /> : null}
        {validationError ? <span className="label label-danger">{validationError}</span> : null}
      </div>
      <div className="col-xs-12 col-lg-6 padding-bottom-small">
        <select
          onChange={(evt: any) => setEditingSubjectField(_id, "parentId", evt.target.value)}
          value={editingSubject.parentId || ""}
          className="form-control"
        >
          <option value={""}>No Parent</option>
          {editingSubject.eligibleParents.map(s => (
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
          onColorChosen={color => setEditingSubjectField(_id, "backgroundColor", color)}
        />
        <CustomColorPicker
          labelStyle={{ marginLeft: "5px", marginTop: "3px", display: "inline-block" }}
          onColorChosen={color => setEditingSubjectField(_id, "backgroundColor", color)}
          currentColor={editingSubject.backgroundColor}
        />
      </div>
      <div className="col-xs-12 col-lg-6">
        <div className={textColorSaveBox}>
          <a onClick={() => cancelSubjectEdit(_id)}>Cancel</a>
          <BootstrapButton
            disabled={isSubjectSaving}
            style={{ marginRight: "5px", marginLeft: "10px" }}
            preset="primary-xs"
            onClick={() => saveChanges(editingSubject, subject, subjectHash, updateSubject)}
          >
            <i className={`fa fa-fw ${isSubjectSaving ? "fa-spinner fa-spin" : "fa-save"}`} />
          </BootstrapButton>
          <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField(_id, "textColor", color)} />
        </div>
      </div>
    </div>
  );
};

const PendingDeleteSubjectDisplay = props => {
  const { className, deleteMessage, subject } = props;
  const { name, _id, backgroundColor, textColor } = subject;
  const { subjectHash } = useSubjectsState();
  const { deleteSubject: runDelete } = useSubjectMutations();
  const [{}, { cancelSubjectDelete, deleteSubject }] = useContext(SubjectsDnDContext);

  return (
    <div className={className + " delete-pane"}>
      <div className="col-xs-12">
        <div className="label label-default" style={{ display: "inline", color: textColor, backgroundColor }}>
          {name}
        </div>
        <BootstrapButton onClick={() => deleteSubject(_id, subjectHash, runDelete)} style={{ marginLeft: "20px" }} preset="danger-xs">
          {deleteMessage}
        </BootstrapButton>
        <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{ marginLeft: "20px" }} className="btn btn-xs">
          Cancel
        </BootstrapButton>
      </div>
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
  const { style = {}, noDrop } = props;

  const SD: any = SubjectDisplay;

  const { subjectHash } = useSubjectsState();
  const { updateSubject: runInsert } = useSubjectMutations();
  const [{}, { setNewParent }] = useContext(SubjectsDnDContext);

  return (
    <ul className={listGroup} style={{ marginBottom: "5px", ...style }}>
      {props.subjects.map(subject => (
        <SD key={subject._id} {...{ setNewParent, noDrop, subject, subjectHash, runInsert }} />
      ))}
    </ul>
  );
};

const TopSubjectsList = DragDropContext(HTML5Backend)(props => {
  const [{ online, isTouch }] = useContext(AppContext);
  const [{}, { addNewSubject }] = useContext(SubjectsDnDContext);
  const pendingSubjectsLookup = usePendingSubjects();
  let rootPendingSubjects = pendingSubjectsLookup["root"] || [];
  let topLevelSubjects = useLevelSubjectsSortedSelector();
  let allSubjects = [...rootPendingSubjects, ...topLevelSubjects];

  let SDL: any = SubjectDragLayer;

  return (
    <div className="standard-module-container">
      <div className="subject-row row subject-row">
        <div className="col-lg-6 col-md-8 col-xs-12">
          <BootstrapButton disabled={!online} onClick={() => addNewSubject()} preset="primary">
            New subject
          </BootstrapButton>
          <SubjectList subjects={allSubjects} />
          {isTouch ? <SDL /> : null}
        </div>
      </div>
    </div>
  );
});

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
