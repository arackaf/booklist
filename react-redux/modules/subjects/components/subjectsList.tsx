import React, { CSSProperties, FunctionComponent, useLayoutEffect, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { editingSubjectHashSelector, pendingSubjectsSelector, draggingSubjectSelector } from "modules/subjects/reducers/reducer";
import * as actionCreators from "modules/subjects/reducers/actionCreators";
import { DragSource, DragDropContext, DropTarget, DragLayer } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import BootstrapButton from "applicationRoot/components/bootstrapButton";
import ColorsPalette from "applicationRoot/components/colorsPalette";
import CustomColorPicker from "applicationRoot/components/customColorPicker";
import { store } from "applicationRoot/store";
import { SubjectType } from "modules/subjects/reducers/reducer";
import { useLevelSubjectsSortedSelector, useChildMapSelector } from "applicationRoot/subjectsState";

type dragLayerType = {
  item: any;
  currentOffset: { x: number; y: number };
  isDragging: boolean;
};

const SubjectDragLayer = connect(state => {
  return {
    currentlyDragging: state.subjectsModule.draggingId
  };
})(
  DragLayer((monitor, x) => {
    return {
      item: monitor.getItem(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    };
  })((props => {
    let { isDragging, currentOffset, item, currentlyDragging } = props;
    if (!currentOffset || !item || !currentlyDragging || !isDragging) return null;
    let { x, y } = currentOffset;

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
  }) as FunctionComponent<{ currentlyDragging: string } & dragLayerType>)
);

type dropTargetType = {
  connectDropTarget: any;
  isOver: boolean;
  canDrop: boolean;
};

type subjectDisplayProps = {
  subject: SubjectType & { candidateMove: boolean };
  subjectDraggingOver: any;
  subjectNotDraggingOver: any;
  noDrop: boolean;
};

const SubjectDisplay = connect(
  (state, ownProps) => {
    return {
      isCurrentDropTarget: state.subjectsModule.currentDropCandidateId == ownProps.subject._id
    };
  },
  { ...actionCreators }
)(
  DropTarget(
    "subject",
    {
      canDrop(props, monitor) {
        let sourceSubject = monitor.getItem(),
          { subject: targetSubject } = props as any,
          isCurrentParent = sourceSubject.path && new RegExp(`,${targetSubject._id},$`).test(sourceSubject.path);

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

        props.setNewParent(sourceSubject, targetSubject);
      }
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  )((props => {
    let isOver = props.isOver && props.canDrop;
    let { subject, connectDropTarget } = props;
    let { _id, candidateMove } = subject;
    let pendingSubjectDrop = props.isOver && props.canDrop;
    let style: any = {};
    let noDrop = candidateMove || props.noDrop;

    useLayoutEffect(() => {
      if (isOver) {
        props.subjectDraggingOver(_id);
      } else {
        props.subjectNotDraggingOver(_id);
      }
    }, [isOver]);

    if (candidateMove) {
      style.backgroundColor = "lavender";
    }

    return (
      <li
        className={`list-group-item ${pendingSubjectDrop ? "pending-subject-drop" : ""}`}
        key={_id}
        style={{ ...style, paddingTop: 0, paddingBottom: 0 }}
      >
        <SubjectDisplayContent connectDropTarget={connectDropTarget} noDrop={noDrop} subject={subject} />
      </li>
    );
  }) as FunctionComponent<subjectDisplayProps & { isCurrentDropTarget: boolean } & dropTargetType>)
);

const SubjectDisplayContent = connect(
  (state, ownProps) => {
    let subjectsModule = state.subjectsModule,
      editingSubjectsHash = subjectsModule.editingSubjectsHash,
      pendingDeleteHash = subjectsModule.pendingDeleteHash,
      deletingHash = subjectsModule.deletingHash,
      pendingSubjectsLookup = pendingSubjectsSelector(state),
      draggingSubject = draggingSubjectSelector(state),
      currentDropCandidateId = subjectsModule.currentDropCandidateId,
      subject = ownProps.subject,
      { _id } = subject,
      dropCandidateSubject = currentDropCandidateId == _id ? draggingSubject : null,
      subjectsSaving = state.subjectsModule.subjectsSaving,
      subjectsSaved = state.subjectsModule.subjectsSaved,
      { editingSubjectsHash: shapedEditingSubjectHash } = editingSubjectHashSelector(state);

    return {
      isEditingSubject: !!editingSubjectsHash[_id],
      isPendingDelete: pendingDeleteHash[_id],
      isDeleting: deletingHash[_id],
      isSubjectSaving: !!subjectsSaving[ownProps.subject._id],
      isSubjectSaved: !!subjectsSaved[ownProps.subject._id],
      pendingChildren: pendingSubjectsLookup[_id],
      dropCandidateSubject,
      editingSubject: shapedEditingSubjectHash[ownProps.subject._id],
      colors: state.app.colors
    };
  },
  { ...actionCreators }
)(
  DragSource(
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
    let {
      subject,
      connectDragSource,
      connectDragPreview,
      noDrop,
      isPendingDelete,
      isDeleting,
      connectDropTarget,
      pendingChildren = [],
      isEditingSubject,
      dropCandidateSubject,
      isSubjectSaving,
      isSubjectSaved,
      editingSubject,
      colors
    } = props;
    let childSubjectsMap = useChildMapSelector();
    let childSubjects = childSubjectsMap[subject._id] || [];
    let effectiveChildren = pendingChildren.concat(childSubjects);
    let deleteMessage = childSubjects.length ? "Confirm - child subjects will also be deleted" : "Confirm Delete";

    if (dropCandidateSubject) {
      effectiveChildren.unshift(dropCandidateSubject);
    }

    let classToPass = "row padding-top padding-bottom";
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
  })
);

const DefaultSubjectDisplay = connect(
  state => ({ online: state.app.online }),
  { ...actionCreators }
)(props => {
  let {
    connectDropTarget,
    connectDragSource,
    isSubjectSaving,
    isSubjectSaved,
    className,
    subject,
    beginSubjectEdit,
    addNewSubject,
    beginSubjectDelete,
    noDrop,
    online
  } = props;

  let { _id, name, backgroundColor, textColor } = subject;
  let mainIcon = isSubjectSaving ? (
    <i className="fa fa-fw fa-spinner fa-spin" />
  ) : isSubjectSaved ? (
    <i style={{ color: "green" }} className="fa fa-fw fa-check" />
  ) : isTouch || !online ? null : (
    connectDragSource(<i className="fa fa-fw fa-arrows drag-handle" />)
  );

  return (noDrop ? c => c : connectDropTarget)(
    <div className={className}>
      <div className="col-lg-12 show-on-hover-parent">
        {mainIcon}
        &nbsp;
        <div
          className="label label-default"
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            maxWidth: "100%",
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "text-top"
          }}
        >
          {name || "<label preview>"}
        </div>{" "}
        {!isSubjectSaving ? (
          <a className="show-on-hover-inline inline-filter" onClick={() => beginSubjectEdit(_id)}>
            <i className="fa fa-fw fa-pencil" />
          </a>
        ) : null}
        {!isSubjectSaving ? (
          <a className="show-on-hover-inline inline-filter" onClick={() => addNewSubject(_id)}>
            <i className="fa fa-fw fa-plus" />
          </a>
        ) : null}
        {!isSubjectSaving ? (
          <a className="show-on-hover-inline inline-filter" onClick={() => beginSubjectDelete(_id)} style={{ color: "red", marginLeft: "20px" }}>
            <i className="fa fa-fw fa-trash" />
          </a>
        ) : null}
      </div>
    </div>
  );
});

const EditingSubjectDisplay = connect(
  null,
  { ...actionCreators }
)(props => {
  const inputEl = useRef(null);
  useEffect(() => inputEl.current.focus(), []);

  const subjectEditingKeyDown = evt => {
    let key = evt.keyCode || evt.which;
    if (key == 13) {
      let { subject, editingSubject, saveChanges } = props;
      saveChanges(editingSubject, subject);
    }
  };

  const { setEditingSubjectField, cancelSubjectEdit, isSubjectSaving, className, subject, editingSubject, saveChanges, colors } = props;
  const { _id, name } = subject;
  const textColors = ["#ffffff", "#000000"];
  const { validationError } = editingSubject;

  return (
    <div className={className}>
      <div className="col-xs-12 col-lg-6" style={{ overflow: "hidden" }}>
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
      <div className="col-xs-12 col-lg-9">
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
      <div className="col-xs-12 col-lg-1 padding-bottom-small">
        <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField(_id, "textColor", color)} />
      </div>
      <div className="col-xs-12 col-lg-2">
        <BootstrapButton
          disabled={isSubjectSaving}
          style={{ marginRight: "5px" }}
          preset="primary-xs"
          onClick={() => saveChanges(editingSubject, subject)}
        >
          <i className={`fa fa-fw ${isSubjectSaving ? "fa-spinner fa-spin" : "fa-save"}`} />
        </BootstrapButton>
        <a onClick={() => cancelSubjectEdit(_id)}>Cancel</a>
      </div>
    </div>
  );
});

const PendingDeleteSubjectDisplay = connect(
  null,
  { ...actionCreators }
)((props => {
  let { className, deleteMessage, deleteSubject, cancelSubjectDelete, subject } = props;
  let { name, _id } = subject;

  return (
    <div className={className}>
      <div className="col-lg-12">
        {name}
        <BootstrapButton onClick={() => deleteSubject(_id)} style={{ marginLeft: "20px" }} preset="danger-xs">
          {deleteMessage}
        </BootstrapButton>
        <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{ marginLeft: "20px" }} preset="primary-xs">
          Cancel
        </BootstrapButton>
      </div>
    </div>
  );
}) as FunctionComponent<typeof actionCreators & any>);

const DeletingSubjectDisplay = connect(
  null,
  { ...actionCreators }
)(props => {
  let { name, className } = props;
  return (
    <div className={className}>
      <div className="col-lg-12">
        {name}
        <BootstrapButton preset="danger-xs" disabled={true} style={{ marginLeft: "20px" }}>
          Deleting <i className="fa fa-fw fa-spinner fa-spin" />
        </BootstrapButton>
      </div>
    </div>
  );
});

const SubjectList = props => {
  let { style = {}, noDrop } = props;

  let SD: any = SubjectDisplay;

  return (
    <ul className="list-group" style={{ marginBottom: "5px", ...style }}>
      {props.subjects.map(subject => (
        <SD key={subject._id} noDrop={noDrop} subject={subject} />
      ))}
    </ul>
  );
};

let isTouch = (store.getState() as any).app.isTouch;

type subjectsComponentPropsType = {
  topLevelSubjects: any;
  pendingSubjectsLookup: any;
  addNewSubject: any;
};

export default DragDropContext(HTML5Backend)(
  connect(
    state => {
      return {
        pendingSubjectsLookup: pendingSubjectsSelector(state),
        online: state.app.online
      };
    },
    { ...actionCreators }
  )((props => {
    let { addNewSubject, pendingSubjectsLookup, online } = props;
    let rootPendingSubjects = pendingSubjectsLookup["root"] || [];
    let topLevelSubjects = useLevelSubjectsSortedSelector();
    let allSubjects = [...rootPendingSubjects, ...topLevelSubjects];

    let SDL: any = SubjectDragLayer;

    return (
      <div className="row" style={{ marginLeft: "0px", marginRight: "0px", marginBottom: "50px" }}>
        <div style={{ marginTop: "5px" }} className="col-lg-6 col-xs-12">
          <BootstrapButton disabled={!online} onClick={() => addNewSubject()} preset="primary">
            New subject
          </BootstrapButton>
          <br />
          <br />
          <SubjectList subjects={allSubjects} />
          {isTouch ? <SDL /> : null}
        </div>
      </div>
    );
  }) as FunctionComponent<subjectsComponentPropsType & typeof actionCreators & { online: any }>)
);
