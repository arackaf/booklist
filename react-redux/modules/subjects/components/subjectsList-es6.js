import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import {DragSource, DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragSource('subject', {
    beginDrag(props, monitor, component){
        return props;
    }
}, (connect, monitor) => ({
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging()
}))
class SubjectDisplay extends Component {
    render(){
        let {_id, name, connectDragSource} = this.props;

        return (
            connectDragSource(<li key={_id}>{name}</li>)
        )
    }
}

export default class SubjectsList extends Component{
    render(){
        return (
            <div style={{ margin: '50px' }}>
                <ul>{this.props.subjects.map(subject => <SubjectDisplay {...subject} />)}</ul>
            </div>
        )
    }
}

const SubjectsListConnected = connect(selector, { ...actionCreators })(SubjectsList);

export default DragDropContext(HTML5Backend)(SubjectsListConnected);