import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selector} from 'modules/subjects/reducers/reducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';

export default class SubjectsList extends Component{
    render(){
        return (
            <div style={{ margin: '50px' }}>
                <ul>{this.props.subjects.map(s =>
                    <li key={s._id}>{s.name}</li>
                )}</ul>
            </div>
        )
    }
}

const SubjectsListConnected = connect(selector, { ...actionCreators })(SubjectsList);

export default SubjectsListConnected;