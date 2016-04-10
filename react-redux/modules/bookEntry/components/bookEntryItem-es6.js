const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookEntryItem extends React.Component{
    render(){
        return (
            <div>
                <div className='row'>
                    <div className='col-sm-8 form-horizontal'>
                        <div className='form-group row'>
                            <label className='control-label col-sm-4'>Input ISBN </label>
                            <div className='col-sm-8'>
                                <input className='form-control' ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)} disabled={this.props.retrieving}  />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4 pull-left'>
                        { this.props.retrieving ? <span className="label label-default">Queuing</span> : null }
                        { this.props.queued ? <span className="label label-success">Book is queued</span> : null }
                    </div>
                </div>
            </div>
        );
    }
    focusInput(){
        ReactDOM.findDOMNode(this.refs.input).focus();
    }
    keyDown(evt){
        if (evt.keyCode == 13){
            this.props.entryFinished();
        }
    }
}

export default BookEntryItem;