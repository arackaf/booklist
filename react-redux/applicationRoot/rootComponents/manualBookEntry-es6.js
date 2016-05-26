import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';
import { Dropzone } from 'react-redux-util/react-dropzone';

const Modal = ReactBootstrap.Modal;

class ManualBookEntry extends React.Component {
    constructor(){
        super();

        this.state = { bookEditing: null };

        this.syncStateFromInput = name => evt => this.setState({ bookEditing: { ...this.state.bookEditing, [name]: evt.target.value } });
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
            this.props.saveBook({ ...this.state.bookEditing, authors: this.state.bookEditing.authors.filter(a => a) });
        }
    }
    closeModal(){
        this.props.onClosing()
    }
    componentWillReceiveProps(nextProps){
        if (this.props.bookToEdit !== nextProps.bookToEdit){
            let bookToStart = nextProps.bookToEdit;
            this.setState({
                bookEditing: bookToStart,
                titleMissing: false,
                authorsChanged: false
            });
            this.revertTo = bookToStart;
        }
    }
    revert(){
        this.setState({ bookEditing: this.revertTo });
    }
    render(){
        let bookEditing = this.state.bookEditing;

        //Modal collects an existing book to edit, and spreads into state.  Yes, it's an anti-pattern, but it makes dealing with field changes tolerable
        //Modal eventually calls save method passed from above.
        //Parent component passes in a new book as needed to restart editing
        return (
            <Modal show={!!this.props.isOpen} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Manually enter a book
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.bookEditing ?
                    <form>
                        <div className={"form-group " + (!this.state.bookEditing.title && this.state.titleMissing ? "has-error" : "")}>
                            <label>Title</label>
                            <input onChange={this.syncStateFromInput('title')} value={bookEditing.title} className="form-control" placeholder="Title (required)" />
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>ISBN</label>
                                    <input onChange={this.syncStateFromInput('isbn')} value={bookEditing.isbn} className="form-control" placeholder="ISBN" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <input onChange={this.syncStateFromInput('pages')} value={bookEditing.pages} type="number" className="form-control" placeholder="Number of pages" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Publisher</label>
                                    <input onChange={this.syncStateFromInput('publisher')} value={bookEditing.publisher} className="form-control" placeholder="Publisher" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Published</label>
                                    <input onChange={this.syncStateFromInput('publicationDate')} value={bookEditing.publicationDate} className="form-control" placeholder="Publication date" />
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
                                        Add as many authors as the book has. Blanks will be ignored.
                                    </div> : null
                                }
                            </div>
                        </div>

                        <br />
                        <br />
                        <div className="row">
                            <div className="col-xs-6">
                                <Dropzone style={{ border: '3px groove', padding: 40 }} onDrop={files => this.onDrop(files)} multiple={false}>
                                    <div>Upload an image.</div>
                                </Dropzone>
                            </div>
                            <div className="col-xs-6">
                                Preview
                            </div>
                        </div>
                    </form> : null }
                    { this.props.isSaved ? <div className="alert alert-success alert-slim" style={{ marginTop: 10, marginBottom: 0 }}>{this.props.saveMessage}</div> : null }

                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton className="pull-right" preset="primary" running={this.props.isSaving} disabled={this.props.isSaved} runningText='Saving' onClick={() => this.save(this.state.bookEditing)}>Set</AjaxButton>
                    <br /><br /><br />
                    <BootstrapButton preset="danger" onClick={() => this.props.isSaved ? this.props.startOver() : this.revert()}>Clear</BootstrapButton>&nbsp;&nbsp;
                    <BootstrapButton preset="default" onClick={() => this.closeModal()}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManualBookEntry;