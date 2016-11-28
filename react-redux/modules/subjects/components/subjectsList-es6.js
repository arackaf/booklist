import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector, getChildSubjectsSorted} from 'modules/subjects/reducers/reducer';
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

const mapSubjectDisplayState = (state, ownProps) => {
    let selectedState = selector(state);
    return {
        ...selectedState,
        childSubjects: getChildSubjectsSorted(ownProps.subject._id, selectedState.subjectHash)
    }
};

@connect(mapSubjectDisplayState, {...actionCreators})
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
                editingSubjectsHash,
                subjectsSaving,
                subjectsSaved,
                colors,
                setEditingSubjectField,
                saveChanges,
                pendingSubjectsLookup,
                pendingDeleteHash,
                deletingHash,
                beginSubjectDelete,
                cancelSubjectDelete,
                deleteSubject,
                connectDropTarget,
                childSubjects
            } = this.props,
            {_id, name} = subject,
            editingSubject = editingSubjectsHash[_id],
            isSubjectSaving = !!subjectsSaving[_id],
            pendingChildren = pendingSubjectsLookup[_id] || [],
            effectiveChildren = pendingChildren.concat(childSubjects),
            isPendingDelete = pendingDeleteHash[_id],
            deleteMessage = childSubjects.length ? 'Confirm - child subjects will also be deleted' : 'Confirm Delete',
            isDeleting = deletingHash[_id];

        let textColors = ['#ffffff', '#000000'];

        let mainIcon =
            isSubjectSaving
                ? <i className="fa fa-fw fa-spinner fa-spin"></i>
                : (subjectsSaved[subject._id] ?
                    <i style={{color: 'green'}} className="fa fa-fw fa-check"></i> : connectDragSource(<i className="fa fa-fw fa-arrows"></i>));

        let contents = editingSubject ? [
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
                <a onClick={() => this.props.cancelSubjectEdit(_id)}>Cancel</a>
            </div>
        ] : isDeleting ? [
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton preset="danger-xs" disabled={true} style={{marginLeft: '20px'}}>Deleting <i className="fa fa-fw fa-spinner fa-spin"></i></BootstrapButton>
                </div>
            ] :
            (isPendingDelete ?
            [
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton onClick={() => deleteSubject(subject)} style={{marginLeft: '20px'}} preset="danger-sm">{deleteMessage}</BootstrapButton>
                    <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{marginLeft: '20px'}} preset="primary-sm">Cancel</BootstrapButton>
                </div>
            ] :
            [
                <div className="col-lg-12 show-on-hover-parent">
                    {mainIcon}
                    {' '}
                    {name}
                    {' '}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => this.props.beginSubjectEdit(_id)}><i className="fa fa-fw fa-pencil"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => this.props.addNewSubject(_id)}><i className="fa fa-fw fa-plus"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline" onClick={() => beginSubjectDelete(_id)} style={{color: 'red', marginLeft: '20px'}}><i className="fa fa-fw fa-trash"></i></a> : null}
                </div>
            ]);

            let dropEnabled = !isDeleting && !isPendingDelete && !noDrop;
            let wrapper = dropEnabled ? connectDropTarget : c => c;
        return (
            connectDragPreview(
                <div>
                    {wrapper(
                        <div className="row padding-top padding-bottom">
                            {contents}
                        </div>
                    )}
                    {effectiveChildren.length ? <SubjectList noDrop={noDrop} style={{ marginTop: 0 }} subjects={effectiveChildren} /> : null}
                </div>
            )
        )
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