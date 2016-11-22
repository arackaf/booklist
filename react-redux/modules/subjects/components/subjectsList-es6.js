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
        //debugger;
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
    render(){
        let {subject, connectDropTarget} = this.props,
            {_id, children: childSubjects} = subject,
            style = this.props.isOnlyOver && this.props.canDrop ? { border: '3px solid green' } : {},
            draggingSubject = null;

        if (this.props.canDrop && this.props.isOnlyOver && this.props.draggingSubject){
            draggingSubject = this.props.draggingSubject;
        }

        return (
            connectDropTarget(
                <li className="list-group-item" key={_id} style={style}>
                    <SubjectDisplayContent draggingSubject={draggingSubject} subject={subject} />
                </li>
            )
        );
    }
}

@DragSource('subject', {
    beginDrag: props => props.subject
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
}))
class SubjectDisplayContent extends Component {
    render(){
        let {subject, connectDragSource, connectDragPreview} = this.props,
            {name, children: childSubjects} = subject,
            effectiveChildren = childSubjects.concat();

        if (this.props.draggingSubject){
            effectiveChildren.push(this.props.draggingSubject);
        }

        return (
            connectDragPreview(
                <div>
                    {connectDragSource(<i className="fa fa-fw fa-arrows"></i>)} {name} {this.props.draggingSubject && this.props.draggingSubject.name}
                    {effectiveChildren.length ? <SubjectList style={{ marginTop: '5px' }} subjects={effectiveChildren} /> : null}
                    {this.props.draggingSubject ? <div>{this.props.draggingSubject.name}</div> : null}
                </div>
            )
        )
    }
}


class SubjectList extends Component {
    render(){
        let {style = {}} = this.props;

        return <ul className="list-group" style={{ marginBottom: '5px', ...style }}>{this.props.subjects.map(subject => <SubjectDisplay subject={subject} />)}</ul>;
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