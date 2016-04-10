const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookEntryItem extends React.Component{
    constructor(){
        super();
        this.state = { expanded: false };
    }
    toggle(){
        this.setState({ expanded: !this.state.expanded });
    }
    componentWillReceiveProps(newProps){
        if (!newProps.fetchedInfo){
            this.setState({ expanded: false });
        }
    }
    render(){
        return (
            <div>
                <div className='row'>
                    <div className='col-md-3 form-horizontal'>
                        <div className='form-group'>
                            <label className='control-label col-sm-4'>Input ISBN </label>
                            <div className='col-sm-8'>
                                <input className='form-control' ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)} disabled={this.props.retrieving}  />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9 pull-left'>
                        { this.props.retrieving ? <span>loading....</span> : null }
                        { this.props.fetchedTitle ?
                            <div className="row">
                                <div className="col-xs-11">
                                    <BootstrapButton preset='info-xs' onClick={() => this.toggle()}><i className={this.state.expanded ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'}></i></BootstrapButton>&nbsp;
                                    Saved: { this.props.fetchedTitle }
                                </div>
                                <div className="col-xs-1">
                                    <AjaxButton preset='danger-xs' running={this.props.deleting} onClick={this.props.deleteBook} text='Delete' runningText='Deleting'>Delete</AjaxButton>
                                </div>
                            </div> : null
                        }
                        { this.props.retrieveFailure && !this.props.retrieving ? <span>Could not find isbn: { this.props.fetchedIsbn }</span> : null }
                    </div>
                </div>
                { this.state.expanded ?
                    <div className='row' style={{ marginTop: 10 }}>
                        <div className='col-md-2 hidden-xs'></div>
                        <div className='col-md-1 col-xs-3'>
                            <img src={this.props.fetchedInfo.smallImage} />
                        </div>
                        <div className='col-md-9 col-xs-9'>
                            <span>{this.props.fetchedTitle}</span><br/>
                            <span>{this.props.fetchedInfo.author}</span><br/>
                            <span>{this.props.fetchedInfo.publicationDate ? <span>{'Published ' + this.props.fetchedInfo.publicationDate } <br/></span> : null}</span>
                            <span>{this.props.fetchedInfo.pages ? <span>{this.props.fetchedInfo.pages + ' pages' } <br/></span> : null}</span>
                        </div>
                    </div> : null
                }
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