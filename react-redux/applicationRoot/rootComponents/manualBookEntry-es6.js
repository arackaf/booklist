import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';
import { Dropzone } from 'util/react-dropzone';

const Modal = ReactBootstrap.Modal;

class ManualBookEntry extends React.Component {
    constructor(){
        super();

        this.state = { bookEditing: null };

        this.syncStateFromInput = name => evt => this.setState({ bookEditing: { ...this.state.bookEditing, [name]: evt.target.value } });
        this.SyncedInput = props => <input onChange={this.syncStateFromInput(props.syncName)} value={this.state.bookEditing[props.syncName]} { ...props } />

        this.syncAuthor = index => evt => {
            let newAuthors = this.state.bookEditing.authors.concat();
            newAuthors[index] = evt.target.value;
            this.setState({ bookEditing: { ...this.state.bookEditing, authors: newAuthors } });
        }
    }
    addAuthor(evt){
        evt.preventDefault();
        let bookEditing = this.state.bookEditing;
        this.setState({ authorsChanged: true, bookEditing: Object.assign({}, bookEditing, { authors: bookEditing.authors.concat('') }) });
    }
    save(){
        if (!this.state.bookEditing.title){
            this.setState({ titleMissing: true });
        } else {
            this.setState({ titleMissing: false });

            //trim out empty authors now, so they're not applied in the reducer, and show up as empty entries on subsequent edits
            let bookToSave = { ...this.state.bookEditing, authors: this.state.bookEditing.authors.filter(a => a) };
            if (this.state.pendingSmallImage){
                bookToSave.smallImage = this.state.pendingSmallImage; //only send it if there is one
            }
            this.props.saveBook(bookToSave);
        }
    }
    closeModal(){
        this.props.onClosing()
    }
    componentWillReceiveProps(nextProps){
        if (this.props.bookToEdit !== nextProps.bookToEdit){
            let bookToStart = { ...nextProps.bookToEdit };
            this.revertTo = bookToStart;
            this.revert();
        }
    }
    revert(){
        this.setState({
            bookEditing: this.revertTo,
            titleMissing: false,
            authorsChanged: false,
            pendingSmallImage: '',
            smallCoverUploadError: ''
        });
    }
    onDrop(files) {
        let request = new FormData();
        request.append('fileUploaded', files[0]);

        ajaxUtil.postWithFiles('/react-redux/upload', request, res => {
            if (res.error){
                this.setState({ pendingSmallImage: '', smallCoverUploadError: res.error });
            } else {
                this.setState({ pendingSmallImage: res.smallImagePath, smallCoverUploadError: '' });
            }

        });
    }
    clearPendingSmallImage(){
        this.setState({ pendingSmallImage: '' });
    }
    render(){
        let SyncedInput = this.SyncedInput;

        //Modal collects an existing book to edit, and spreads into state.  Yes, it's an anti-pattern, but it makes dealing with field changes tolerable
        //Modal eventually calls save method passed from above.
        //Parent component passes in a new book as needed to restart editing
        return (
            <Modal show={!!this.props.isOpen} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.bookEditing ?
                    <form>
                        <div className={"form-group " + (!this.state.bookEditing.title && this.state.titleMissing ? "has-error" : "")}>
                            <label>Title</label>

                            <SyncedInput syncName="title" className="form-control" placeholder="Title (required)" />
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>ISBN</label>
                                    <SyncedInput syncName="isbn" className="form-control" placeholder="ISBN" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <SyncedInput syncName="pages" type="number" className="form-control" placeholder="Number of pages" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Publisher</label>
                                    <SyncedInput syncName="publisher" className="form-control" placeholder="Publisher" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Published</label>
                                    <SyncedInput syncName="publicationDate" className="form-control" placeholder="Publication date" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {(this.state.bookEditing.authors || []).map((author, $index) =>
                                <div className="col-xs-4">
                                    <div className="form-group">
                                        <label>Author</label>
                                        <input onChange={this.syncAuthor($index)} value={author} className="form-control" placeholder={`Author ${$index + 1}`} />
                                    </div>
                                </div>
                            )}
                            <div className="col-xs-12">
                                <BootstrapButton onClick={evt => this.addAuthor(evt)} preset="primary-xs"><i className="fa fa-fw fa-plus"></i> Add author</BootstrapButton>
                                { this.state.authorsChanged ?
                                    <div style={{ marginLeft: 5 }} className="label label-primary">
                                        Add as many authors as needed. Blanks will be ignored.
                                    </div> : null
                                }
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col-xs-6">
                                <Dropzone style={{ border: '3px groove', padding: 30 }} onDrop={files => this.onDrop(files)} multiple={false}>
                                    <div>{this.props.dragTitle}</div>
                                </Dropzone>
                            </div>
                            <div className="col-xs-6">
                                {this.state.pendingSmallImage ?
                                    <div>
                                        <img src={this.state.pendingSmallImage} />
                                        <br />
                                        <br />
                                        <BootstrapButton preset="danger-xs" onClick={() => this.clearPendingSmallImage()}>Clear image</BootstrapButton>
                                    </div> : null}
                                {this.state.smallCoverUploadError ? <div className="label label-danger">{this.state.smallCoverUploadError}</div> : null}
                            </div>
                        </div>
                    </form> : null }
                    { this.props.isSaved ? <div className="alert alert-success alert-slim" style={{ marginTop: 10, marginBottom: 0 }}>{this.props.saveMessage}</div> : null }
                    <hr style={{ marginTop: 10, marginBottom: 10 }} />
                    <BootstrapButton preset="danger-xs" onClick={() => this.props.isSaved ? this.props.startOver() : this.revert()}>Clear all</BootstrapButton>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton className="pull-right" preset="primary" running={this.props.isSaving} disabled={this.props.isSaved} runningText='Saving' onClick={() => this.save(this.state.bookEditing)}>Set</AjaxButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManualBookEntry;