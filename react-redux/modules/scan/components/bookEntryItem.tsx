import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';

class BookEntryItem extends Component<any, any>{
    render(){
        return (
            <div>
                <div className='row'>
                    <div className='col-sm-8 form-horizontal'>
                        <div className='form-group row'>
                            <label className='control-label col-sm-4'>Input ISBN </label>
                            <div className='col-sm-8'>
                                <input className='form-control' ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)} disabled={this.props.queueing}  />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 pull-left'>
                        { this.props.queueing ? <span className="label label-default">Queuing</span> : null }
                        { this.props.queued ? <span className="label label-success">Book is queued</span> : null }
                    </div>
                </div>
            </div>
        );
    }
    focusInput(){
        (findDOMNode(this.refs.input) as any).focus();
    }
    selectInput(){
        (findDOMNode(this.refs.input) as any).select();
    }
    keyDown(evt){
        if (evt.keyCode == 13){
            this.props.entryFinished();
        }
    }
}

export default BookEntryItem;