import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext, DropTarget, DragLayer} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DropTarget('subject', {
    canDrop(props, monitor){
        let sourceSubject = monitor.getItem(),
            { subject: targetSubject } = props;

        return sourceSubject._id != targetSubject._id
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
class _SubjectDisplay extends Component {
    componentDidUpdate(prevProps){
        let wasOver = prevProps.isOnlyOver && prevProps.canDrop,
            isOver = this.props.isOnlyOver && this.props.canDrop,
            notOverAtAll = !this.props.isOver,
            {subject} = this.props,
            {_id} = subject;

        if (!wasOver && isOver){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, _id);
        } else if (notOverAtAll && this.props.currentDropCandidateId == _id){
            this.props.subjectDraggingOver(this.props.draggingSubject._id, null);
        }
    }
    render(){
        let {subject, connectDropTarget} = this.props,
            {_id, candidateMove, children: childSubjects} = subject,
            style = this.props.isOnlyOver && this.props.canDrop ? { border: '3px solid green' } : {},
            noDrag = candidateMove || this.props.noDrag;

        return (
              noDrag ?
                <li className="list-group-item" key={_id} style={style}>
                    <SubjectDisplayContent noDrag={noDrag} subject={subject} />
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

const SubjectDisplay = connect(selector, { ...actionCreators })(_SubjectDisplay);

@DragSource('subject', {
    beginDrag: props => props.subject
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
}))
class SubjectDisplayContent extends Component {
    render(){
        let {subject, connectDragSource, connectDragPreview, noDrag} = this.props,
            {name, children: childSubjects} = subject;

        return (
            connectDragPreview(
                <div>
                    {connectDragSource(<i className="fa fa-fw fa-arrows"></i>)} {name}
                    {childSubjects.length ? <SubjectList noDrag={noDrag} style={{ marginTop: '5px' }} subjects={childSubjects} /> : null}
                </div>
            )
        )
    }
}


class SubjectList extends Component {
    render(){
        let {style = {}, noDrag} = this.props;

        return <ul className="list-group" style={{ marginBottom: '5px', ...style }}>{this.props.subjects.map(subject => <SubjectDisplay noDrag={noDrag} subject={subject} />)}</ul>;
    }
}

export default class SubjectsComponent extends Component{
    render(){
        return (
            <div style={{ margin: '50px' }}>
                <SubjectList subjects={this.props.subjects} />
            </div>
        )
    }
}

const SubjectsComponentConnected = connect(selector, { ...actionCreators })(SubjectsComponent);

export default DragDropContext(HTML5Backend)(SubjectsComponentConnected);