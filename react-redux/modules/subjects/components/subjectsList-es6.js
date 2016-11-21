import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext, DropTarget, DragLayer} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragSource('subject', {
    beginDrag(props, monitor, component){
        return props;
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
}))
@DropTarget('subject', {
    canDrop(props, monitor){
        let { subject: sourceSubject } = monitor.getItem(),
            { subject: targetSubject } = props;
        console.log(sourceSubject.name, targetSubject.name);

        return true;

        return subjects.indexOf(subject) < 0;
        //debugger;
        return false;
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
}))
class SubjectDisplay extends Component {
    render(){
        let {subject, connectDragSource, connectDragPreview, connectDropTarget} = this.props,
            {_id, name, children: childSubjects} = subject;

        return (
            connectDropTarget(
                connectDragPreview(
                    <li className="list-group-item" key={_id}>
                        {connectDragSource(<i className="fa fa-fw fa-arrows"></i>)} {name}
                        {childSubjects.length ? <SubjectList subjects={childSubjects} /> : null}
                    </li>
                )
            )
        );
    }
}


class SubjectList extends Component {
    render(){
        let { isOver, canDrop } = this.props;

        return <ul className="list-group" style={{ marginBottom: '5px' }}>{this.props.subjects.map(subject => <SubjectDisplay subject={subject} />)}</ul>;
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