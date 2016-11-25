import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext, DropTarget, DragLayer} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

@connect(selector, { ...actionCreators })
@DropTarget('subject', {
    canDrop(props, monitor){
        let sourceSubject = monitor.getItem(),
            { subject: targetSubject } = props,
            isCurrentParent = sourceSubject.path && new RegExp(`,${targetSubject._id},$`).test(sourceSubject.path);

        return sourceSubject._id != targetSubject._id
                && !isCurrentParent
                && (monitor.isOver() && monitor.isOver({ shallow: true }))
                && (targetSubject.path || '').indexOf(sourceSubject._id) < 0;
    },
    drop(props, monitor){
        let {subject: targetSubject} = props,
            sourceSubject = monitor.getItem();
        //TODO:
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOnlyOver: monitor.isOver() && monitor.isOver({ shallow: true }),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    draggingSubject: monitor.getItem()
}))
class SubjectDisplay extends Component {
    componentDidUpdate(prevProps){
        let wasOver = prevProps.isOnlyOver && prevProps.canDrop,
            isOver = this.props.isOnlyOver && this.props.canDrop,
            canDrop = this.props.canDrop,
            notOverAtAll = !this.props.isOver,
            {subject} = this.props,
            {_id} = subject;

        if (!wasOver && isOver){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, _id);
        } else if ((notOverAtAll || !canDrop) && this.props.currentDropCandidateId == _id){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, null);
        }
    }
    render(){
        let {subject, connectDropTarget} = this.props,
            {_id, candidateMove} = subject,
            style = this.props.isOnlyOver && this.props.canDrop ? { border: '3px solid green' } : {},
            noDrop = candidateMove || this.props.noDrop;

        if (candidateMove) {
            style.backgroundColor = 'lavender';
        }

        return (
              noDrop ?
                <li className="list-group-item" key={_id} style={style}>
                    <SubjectDisplayContent noDrop={noDrop} subject={subject} />
                </li>
                :
                connectDropTarget(
                    <li className="list-group-item" key={_id} style={style}>
                        <SubjectDisplayContent subject={subject} />
                    </li>
                )
        );
    }
}

@connect(selector, {...actionCreators})
@DragSource('subject', {
    beginDrag: props => props.subject
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
}))
class SubjectDisplayContent extends Component {
    render(){
        let {subject, connectDragSource, connectDragPreview, noDrop, editingSubjectsHash} = this.props,
            {_id, name, children: childSubjects} = subject,
            editingSubject = editingSubjectsHash[_id];

        return (
            connectDragPreview(
                <div>
                    {connectDragSource(<i className="fa fa-fw fa-arrows"></i>)}&nbsp;
                    {editingSubject ? <input style={{width:'150px', display: 'inline'}} className="form-control" /> : name}&nbsp;
                    <BootstrapButton preset="default-xs" onClick={() => this.props.beginSubjectEdit(_id)}><i className="fa fa-fw fa-pencil"></i></BootstrapButton>
                    {childSubjects.length ? <SubjectList noDrop={noDrop} style={{ marginTop: '10px' }} subjects={childSubjects} /> : null}
                </div>
            )
        )
    }
}


class SubjectList extends Component {
    render(){
        let {style = {}, noDrop} = this.props;

        return <ul className="list-group" style={{ marginBottom: '5px', ...style }}>{this.props.subjects.map(subject => <SubjectDisplay noDrop={noDrop} subject={subject} />)}</ul>;
    }
}

@DragDropContext(HTML5Backend)
@connect(selector, { ...actionCreators })
export default class SubjectsComponent extends Component{
    render(){
        return (
            <div style={{ margin: '50px' }}>
                <SubjectList subjects={this.props.subjects} />
            </div>
        )
    }
}