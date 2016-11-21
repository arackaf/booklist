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
class SubjectDisplay extends Component {
    render(){
        let {subject, connectDragSource, connectDragPreview} = this.props,
            {_id, name, children: childSubjects} = subject;

        return (
            connectDragPreview(
                <li className="list-group-item" key={_id}>
                    {connectDragSource(<i className="fa fa-fw fa-arrows"></i>)} {name}
                    {childSubjects.length ? <SubjectList subjects={childSubjects} /> : null}
                </li>
            )
        );
    }
}


@DropTarget('subject', {}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
}))
class SubjectList extends Component {
    render(){
        let { isOver, canDrop, connectDropTarget } = this.props;

        return connectDropTarget(
            <ul className="list-group">{this.props.subjects.map(subject => <SubjectDisplay subject={subject} />)}</ul>
        );
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