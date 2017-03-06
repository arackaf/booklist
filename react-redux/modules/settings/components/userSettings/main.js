import React, { Component } from 'react';
import {connect} from 'react-redux';
import {selector} from '../../reducers/userSettings/reducer';
import * as actionCreators from '../../reducers/userSettings/reducer';
import Loading from 'applicationRoot/components/loading';

@connect(selector, {...actionCreators})
export default class UserSettings extends Component {
    render() {
        return (
            <div style={{position: 'relative'}}>
                {this.props.loading ? 
                    <Loading /> 
                    : 
                    <div style={{padding: '10px'}}>
                        <div className="form-group">
                            <label className='checkbox'>Allow your book collection to be viewed publicly? <input defaultChecked={this.props.isPublic} type='checkbox' style={{marginLeft: '5px'}} /></label>
                        </div>
                    </div>
                }

            </div>
        );
    }
}