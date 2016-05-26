import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';

const Modal = ReactBootstrap.Modal;

const defaultEmptyBook = () => ({
    title: '',
    isbn: '',
    pages: '',
    publisher: '',
    publicationDate: '',
    authors: ['']
});

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
        this.setState({ bookEditing: Object.assign({}, bookEditing, { authorsChanged: true, authors: bookEditing.authors.concat('') }) });
    }
    save(){

    }
    closeModal(){
        this.props.onClosing()
    }
    componentWillReceiveProps(nextProps){
        if (!this.props.isOpen && nextProps.isOpen){
            this.setState({ bookEditing: nextProps.bookToEdit || defaultEmptyBook() });
        }
    }
    render(){
        let bookEditing = this.state.bookEditing;

        return (
            <Modal show={!!this.props.isOpen} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Manually enter a book
                        <div>{JSON.stringify(this.state.bookEditing || {})}</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.bookEditing ?
                    <form>
                        <div className="form-group">
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
                                    <label>Published</label>
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
                            {this.state.bookEditing.authors.map((author, $index) =>
                                <div className="col-xs-4">
                                    <div className="form-group">
                                        <label>Author</label>
                                        <input onChange={this.syncAuthor($index)} value={author} className="form-control" placeholder={`Author ${$index + 1}`} />
                                    </div>
                                </div>
                            )}
                            <div className="col-xs-12">
                                <BootstrapButton onClick={evt => this.addAuthor(evt)} preset="primary-xs"><i className="fa fa-fw fa-plus"></i> Add author</BootstrapButton>
                                { this.state.bookEditing.authorsChanged ?
                                    <div style={{ marginLeft: 5 }} className="label label-primary">
                                        Add as many authors as the book has. Blanks will be ignored.
                                    </div> : null
                                }
                            </div>
                        </div>
                    </form> : null }

                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton className="pull-left" preset="primary" running={false} runningText='Saving' onClick={() => this.save()}>Set</AjaxButton>
                    <BootstrapButton preset="danger" onClick={() => this.closeModal()}>Clear</BootstrapButton>
                    <BootstrapButton preset="default" onClick={() => this.closeModal()}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManualBookEntry;