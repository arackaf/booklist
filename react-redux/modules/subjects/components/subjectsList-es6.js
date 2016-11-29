import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector, getChildSubjectsSorted, editingSubjectHashSelector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext, DropTarget, DragLayer} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BootstrapButton, {AjaxButton} from 'applicationRoot/components/bootstrapButton';
import ColorsPalette from 'applicationRoot/components/colorsPalette';

let i = 1;
const mapState = (state, ownProps) => {
    let selectedState = selector(state);
    return {
        isCurrentDropTarget: selectedState.currentDropCandidateId == ownProps.subject._id
    }
};

@connect(mapState, { ...actionCreators })
@DropTarget('subject', {
    canDrop(props, monitor){
        let sourceSubject = monitor.getItem(),
            { subject: targetSubject } = props,
            isCurrentParent = sourceSubject.path && new RegExp(`,${targetSubject._id},$`).test(sourceSubject.path);

        return sourceSubject._id != targetSubject._id
                && !targetSubject.pending
                && !isCurrentParent
                && monitor.isOver()
                && (targetSubject.path || '').indexOf(sourceSubject._id) < 0;
    },
    drop(props, monitor){
        let {subject: targetSubject} = props,
            sourceSubject = monitor.getItem();

        props.setNewParent(sourceSubject, targetSubject);
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingSubject: monitor.getItem()
}))
class SubjectDisplay extends Component {
    componentDidUpdate(prevProps){
        let wasOver = prevProps.isOver && prevProps.canDrop,
            isOver = this.props.isOver && this.props.canDrop,
            canDrop = this.props.canDrop,
            notOverAtAll = !this.props.isOver,
            {subject} = this.props,
            {_id} = subject;

        if (!wasOver && isOver){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, _id);
        } else if ((notOverAtAll || !canDrop) && this.props.isCurrentDropTarget){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, null);
        }
    }
    render(){
        console.log('RENDER', i++);
        let {subject, connectDropTarget} = this.props,
            {_id, candidateMove} = subject,
            pendingSubjectDrop = this.props.isOver && this.props.canDrop,
            style = {},
            noDrop = candidateMove || this.props.noDrop;

        if (candidateMove) {
            style.backgroundColor = 'lavender';
        }

        return (
            <li className={`list-group-item ${pendingSubjectDrop ? 'pending-subject-drop' : ''}`} key={_id} style={{...style, paddingTop: 0, paddingBottom: 0}}>
                <SubjectDisplayContent connectDropTarget={connectDropTarget} noDrop={noDrop} subject={subject} />
            </li>
        );
    }
}

@connect((state, ownProps) => {
    let selectedState = selector(state),
        subjectsModule = state.subjectsModule,
        editingSubjectsHash = subjectsModule.editingSubjectsHash,
        pendingDeleteHash = subjectsModule.pendingDeleteHash,
        deletingHash = subjectsModule.deletingHash,
        pendingSubjectsLookup = subjectsModule.pendingSubjectsHash,
        subject = ownProps.subject,
        {_id} = subject;

    return {
        isEditingSubject: !!editingSubjectsHash[_id],
        pendingChildren: pendingSubjectsLookup[_id],
        isPendingDelete: pendingDeleteHash[_id],
        isDeleting: deletingHash[_id],
        childSubjects: getChildSubjectsSorted(_id, selectedState.subjectHash)
    }
}, {...actionCreators})
@DragSource('subject', {
    beginDrag: props => props.subject
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
}))
class SubjectDisplayContent extends Component {
    render(){
        let {
                subject,
                connectDragSource,
                connectDragPreview,
                noDrop,
                isPendingDelete,
                isDeleting,
                connectDropTarget,
                childSubjects,
                pendingChildren = [],
                isEditingSubject
            } = this.props,
            effectiveChildren = pendingChildren.concat(childSubjects),
            deleteMessage = childSubjects.length ? 'Confirm - child subjects will also be deleted' : 'Confirm Delete';

        let classToPass = 'row padding-top padding-bottom';
        return (
            connectDragPreview(
                <div>
                    {isEditingSubject ? <EditingSubjectDisplay className={classToPass} subject={subject} /> :
                        isDeleting ? <DeletingSubjectDisplay className={classToPass} name={subject.name} /> :
                            isPendingDelete ? <PendingDeleteSubjectDisplay className={classToPass} subject={subject} deleteMessage={deleteMessage} /> :
                                <DefaultSubjectDisplay className={classToPass} subject={subject} connectDragSource={connectDragSource} connectDropTarget={connectDropTarget} noDrop={noDrop} />
                    }

                    {effectiveChildren.length ? <SubjectList noDrop={noDrop} style={{ marginTop: 0 }} subjects={effectiveChildren} /> : null}
                </div>
            )
        )
    }
}

@connect((state, ownProps) => {
   let subjectsSaving = state.subjectsModule.subjectsSaving,
       subjectsSaved = state.subjectsModule.subjectsSaved;

   return {
       isSubjectSaving: !!subjectsSaving[ownProps.subject._id],
       isSubjectSaved: !!subjectsSaved[ownProps.subject._id]
   }
}, {...actionCreators})
class DefaultSubjectDisplay extends Component {
    render(){
        let {connectDropTarget, connectDragSource, isSubjectSaving, isSubjectSaved, className, subject, beginSubjectEdit, addNewSubject, beginSubjectDelete, noDrop} = this.props,
            {_id, name} = subject,
            mainIcon =
                isSubjectSaving ? <i className="fa fa-fw fa-spinner fa-spin"></i> :
                    isSubjectSaved ? <i style={{color: 'green'}} className="fa fa-fw fa-check"></i> :
                        connectDragSource(<i className="fa fa-fw fa-arrows"></i>);

        return (noDrop ? c=>c : connectDropTarget)(
            <div className={className}>
                <div className="col-lg-12 show-on-hover-parent">
                    {mainIcon}&nbsp;
                    {name}
                    {' '}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => beginSubjectEdit(_id)}><i className="fa fa-fw fa-pencil"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => addNewSubject(_id)}><i className="fa fa-fw fa-plus"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => beginSubjectDelete(_id)} style={{color: 'red', marginLeft: '20px'}}><i className="fa fa-fw fa-trash"></i></a> : null}
                </div>
            </div>
        );
    }
}

@connect((state, ownProps) => {
    let subjectsSaving = state.subjectsModule.subjectsSaving,
        subjectHash = state.app.subjectHash,
        editingSubjectsHash = state.subjectsModule.editingSubjectsHash,
        {editingSubjectsHash: shapedEditingSubjectHash} = editingSubjectHashSelector(subjectHash, editingSubjectsHash),
        colors = state.app.colors;

    return {
        isSubjectSaving: !!subjectsSaving[ownProps.subject._id],
        editingSubject: shapedEditingSubjectHash[ownProps.subject._id],
        colors
    }
}, {...actionCreators})
class EditingSubjectDisplay extends Component {
    render(){
        let {setEditingSubjectField, cancelSubjectEdit, isSubjectSaving, className, subject, editingSubject, saveChanges} = this.props,
            {_id, name} = subject,
            textColors = ['#ffffff', '#000000'];

        return (
            <div className={className}>
                <div className="col-xs-12 col-lg-3" style={{overflow: 'hidden'}}>
                    <input onChange={evt => setEditingSubjectField(_id, 'name', evt.target.value)} value={editingSubject.name} className="form-control" />
                    <div className="label label-default" style={{ backgroundColor: editingSubject.backgroundColor, color: editingSubject.textColor, maxWidth: '100%', display: 'inline-block', overflow: 'hidden', marginTop: '5px' }}>{editingSubject.name}</div>
                    {subject.pending ? <br /> : null}
                    {subject.pending ? <span className="label label-warning" style={{marginTop: '5px', display: 'inline-block'}}>This subject is not saved</span> : null}
                </div>,
                <div className="col-xs-12 col-lg-3 padding-bottom-small">
                    <select onChange={evt => setEditingSubjectField(_id, 'parentId', evt.target.value)} value={editingSubject.parentId || ''} className="form-control">
                        <option value={''}>No Parent</option>
                        {editingSubject.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>,
                <div className="col-xs-12 col-lg-4">
                    <ColorsPalette currentColor={editingSubject.backgroundColor} colors={colors} onColorChosen={color => setEditingSubjectField(_id, 'backgroundColor', color)} />
                </div>,
                <div className="col-xs-12 col-lg-1 padding-bottom-small">
                    <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField(_id, 'textColor', color)} />
                </div>,
                <div className="col-xs-12 col-lg-1">
                    <BootstrapButton disabled={isSubjectSaving} style={{marginRight: '5px'}} preset="primary-xs" onClick={() => saveChanges(editingSubject, subject)}><i className={`fa fa-fw ${isSubjectSaving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i></BootstrapButton>
                    <a onClick={() => cancelSubjectEdit(_id)}>Cancel</a>
                </div>
            </div>
        );
    }
}

@connect(null, {...actionCreators})
class PendingDeleteSubjectDisplay extends Component {
    render(){
        let {className, deleteMessage, deleteSubject, cancelSubjectDelete, subject} = this.props,
            {name, _id} = subject;
        return (
            <div className={className}>
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton onClick={() => deleteSubject(_id)} style={{marginLeft: '20px'}} preset="danger-sm">{deleteMessage}</BootstrapButton>
                    <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{marginLeft: '20px'}} preset="primary-sm">Cancel</BootstrapButton>
                </div>
            </div>
        );
    }
}

@connect(null, {...actionCreators})
class DeletingSubjectDisplay extends Component {
    render(){
        let {name, className} = this.props;
        return (
            <div className={className}>
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton preset="danger-xs" disabled={true} style={{marginLeft: '20px'}}>Deleting <i className="fa fa-fw fa-spinner fa-spin"></i></BootstrapButton>
                </div>
            </div>
        );
    }
}

class SubjectList extends Component {
    render(){
        let {style = {}, noDrop} = this.props;

        return <ul className="list-group" style={{ marginBottom: '5px', ...style }}>{this.props.subjects.map(subject => <SubjectDisplay key={subject._id} noDrop={noDrop} subject={subject} />)}</ul>;
    }
}

@DragDropContext(HTML5Backend)
@connect(selector, { ...actionCreators })
export default class SubjectsComponent extends Component{
    render(){
        let {addNewSubject, pendingSubjectsLookup, topLevelSubjects} = this.props,
            rootPendingSubjects = pendingSubjectsLookup['root'] || [],
            allSubjects = [...rootPendingSubjects, ...topLevelSubjects];

        return (
            <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                <BootstrapButton onClick={() => addNewSubject()} preset="primary">New subject</BootstrapButton>
                <br />
                <br />
                <SubjectList subjects={allSubjects} />
            </div>
        )
    }
}