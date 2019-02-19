import React, { Component, CSSProperties, FunctionComponent } from "react";
import { connect } from "react-redux";
import { editingSubjectHashSelector, pendingSubjectsSelector, draggingSubjectSelector } from "modules/subjects/reducers/reducer";
import { subjectChildMapSelector, topLevelSubjectsSortedSelector } from "applicationRoot/rootReducer";
import * as actionCreators from "modules/subjects/reducers/actionCreators";
import { DragSource, DragDropContext, DropTarget, DragLayer } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import ColorsPalette from "applicationRoot/components/colorsPalette";
import CustomColorPicker from "applicationRoot/components/customColorPicker";
import { store } from "applicationRoot/store";
import { SubjectType } from "modules/subjects/reducers/reducer";

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
  noDrop: boolean;
};

@connect(
  (state, ownProps) => {
    return {
      isCurrentDropTarget: state.subjectsModule.currentDropCandidateId == ownProps.subject._id
    };
  },
  { ...actionCreators }
)
@DropTarget(
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
)
class SubjectDisplay extends Component<subjectDisplayProps & { isCurrentDropTarget: boolean } & dropTargetType, any> {
  componentDidUpdate(prevProps) {
    let wasOver = prevProps.isOver && prevProps.canDrop,
      isOver = this.props.isOver && this.props.canDrop,
      canDrop = this.props.canDrop,
      notOverAtAll = !this.props.isOver,
      { subject } = this.props,
      { _id } = subject;

    if (!wasOver && isOver) {
      this.props.subjectDraggingOver(_id);
    } else if ((notOverAtAll || !canDrop) && this.props.isCurrentDropTarget) {
      this.props.subjectDraggingOver(null);
    }
  }
  render() {
    let { subject, connectDropTarget } = this.props,
      { _id, candidateMove } = subject,
      pendingSubjectDrop = this.props.isOver && this.props.canDrop,
      style: any = {},
      noDrop = candidateMove || this.props.noDrop;

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
  }
}

const SubjectDisplayContent = connect(
  (state, ownProps) => {
    let subjectsModule = state.subjectsModule,
      editingSubjectsHash = subjectsModule.editingSubjectsHash,
      pendingDeleteHash = subjectsModule.pendingDeleteHash,
      deletingHash = subjectsModule.deletingHash,
      pendingSubjectsLookup = pendingSubjectsSelector(state),
      childSubjectsMap = subjectChildMapSelector(state),
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
      childSubjects: childSubjectsMap[_id],
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
    (connect, monitor) => ({
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
      childSubjects = [],
      pendingChildren = [],
      isEditingSubject,
      dropCandidateSubject,
      isSubjectSaving,
      isSubjectSaved,
      editingSubject,
      colors
    } = props;
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

@connect(
  null,
  { ...actionCreators }
)
class EditingSubjectDisplay extends Component<any, any> {
  inputEl: any;
  componentDidMount() {
    this.inputEl.focus();
  }
  subjectEditingKeyDown = evt => {
    let key = evt.keyCode || evt.which;
    if (key == 13) {
      let { subject, editingSubject, saveChanges } = this.props;
      saveChanges(editingSubject, subject);
    }
  };
  render() {
    let { setEditingSubjectField, cancelSubjectEdit, isSubjectSaving, className, subject, editingSubject, saveChanges, colors } = this.props,
      { _id, name } = subject,
      textColors = ["#ffffff", "#000000"];
    let { validationError } = editingSubject;

    return (
      <div className={className}>
        <div className="col-xs-12 col-lg-6" style={{ overflow: "hidden" }}>
          <input
            ref={el => (this.inputEl = el)}
            onKeyDown={this.subjectEditingKeyDown}
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
  }
}

@connect(
  null,
  { ...actionCreators }
)
class PendingDeleteSubjectDisplay extends Component<typeof actionCreators & any, any> {
  render() {
    let { className, deleteMessage, deleteSubject, cancelSubjectDelete, subject } = this.props,
      { name, _id } = subject;

    return (
      <div className={className}>
        <div className="col-lg-12">
          {name}
          <BootstrapButton onClick={() => deleteSubject(_id)} style={{ marginLeft: "20px" }} preset="danger-sm">
            {deleteMessage}
          </BootstrapButton>
          <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{ marginLeft: "20px" }} preset="primary-sm">
            Cancel
          </BootstrapButton>
        </div>
      </div>
    );
  }
}

@connect(
  null,
  { ...actionCreators }
)
class DeletingSubjectDisplay extends Component<any, any> {
  render() {
    let { name, className } = this.props;
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
  }
}

class SubjectList extends Component<any, any> {
  render() {
    let { style = {}, noDrop } = this.props;

    let SD: any = SubjectDisplay;

    return (
      <ul className="list-group" style={{ marginBottom: "5px", ...style }}>
        {this.props.subjects.map(subject => (
          <SD key={subject._id} noDrop={noDrop} subject={subject} />
        ))}
      </ul>
    );
  }
}
let isTouch = (store.getState() as any).app.isTouch;

type subjectsComponentPropsType = {
  topLevelSubjects: any;
  pendingSubjectsLookup: any;
  addNewSubject: any;
};

@DragDropContext(HTML5Backend)
@connect(
  state => {
    return {
      topLevelSubjects: topLevelSubjectsSortedSelector(state),
      pendingSubjectsLookup: pendingSubjectsSelector(state),
      online: state.app.online
    };
  },
  { ...actionCreators }
)
export default class SubjectsComponent extends Component<subjectsComponentPropsType & typeof actionCreators & { online: any }, any> {
  render() {
    let { addNewSubject, pendingSubjectsLookup, topLevelSubjects, online } = this.props;
    let rootPendingSubjects = pendingSubjectsLookup["root"] || [];
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
  }
}
