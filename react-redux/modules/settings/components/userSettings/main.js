import React, { Component } from 'react';
import {connect} from 'react-redux';
import {selector} from '../../reducers/userSettings/reducer';
import * as actionCreators from '../../reducers/userSettings/actionCreators';
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
                            <label className='checkbox'>Allow your book collection to be viewed publicly? <input checked={this.props.editing.isPublic} onChange={this.props.editIsPublic} style={{marginLeft: '5px'}} type='checkbox' /></label>
                        </div>
                        {this.props.editing.isPublic ? 
                            <div>
                                <div className="form-group">
                                    <label htmlFor="publicNameInput">Publicly display your name as</label>
                                    <input value={this.props.editing.publicName} onChange={this.props.editPublicName} className="form-control" id="publicNameInput" placeholder="Public name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="publicBooksHeader">Publicly display your name as</label>
                                    <input value={this.props.editing.publicBooksHeader} onChange={this.props.editPublicBooksHeader} className="form-control" id="publicBooksHeader" placeholder="Book header" />
                                </div>
                                <div className="alert alert-info" role="alert">
                                    This is what will show in the navigation when people view your book collection. Leave it blank
                                    to default to [public name]'s Books.  See below
                                </div>
                                <img src='/react-redux/static/publicBookHeaderInfo.png' />
                                <br />
                                {this.props.isDirty ? <button className='btn btn-primary'>Save</button> : null}
                            </div> : null
                        }
                    </div>
                }

            </div>
        );
    }
}