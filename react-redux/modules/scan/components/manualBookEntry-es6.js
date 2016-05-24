import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';

const Modal = ReactBootstrap.Modal;

class ManualBookEntry extends React.Component {
    constructor(){
        super();

        this.state = { bookSaving: { authors: [''] } };
    }
    addAuthor(evt){
        evt.preventDefault();
        let bookSaving = this.state.bookSaving;
        this.setState({ bookSaving: Object.assign({}, bookSaving, { authorsChanged: true, authors: bookSaving.authors.concat('') }) });
    }
    save(){

    }
    closeModal(){
        this.props.onClosing()
    }
    render(){
        return (
            <Modal show={!!this.props.isOpen} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Manually enter a book
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Title</label>
                            <input ref="title" className="form-control" placeholder="Title (required)" />
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>ISBN</label>
                                    <input ref="isbn" className="form-control" placeholder="ISBN" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <input ref="pages" type="number" className="form-control" placeholder="Number of pages" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Published</label>
                                    <input ref="publisher" className="form-control" placeholder="Publisher" />
                                </div>
                            </div>

                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Published</label>
                                    <input ref="publication-date" className="form-control" placeholder="Publication date" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {this.state.bookSaving.authors.map((a, $index) =>
                                <div className="col-xs-4">
                                    <div className="form-group">
                                        <label>Author</label>
                                        <input className="form-control" placeholder={`Author ${$index + 1}`} />
                                    </div>
                                </div>
                            )}
                            <div className="col-xs-12">
                                <BootstrapButton onClick={evt => this.addAuthor(evt)} preset="primary-xs"><i className="fa fa-fw fa-plus"></i> Add author</BootstrapButton>
                                { this.state.bookSaving.authorsChanged ?
                                    <div style={{ marginLeft: 5 }} className="label label-primary">
                                        Add as many authors as the book has. Blanks will be ignored.
                                    </div> : null
                                }
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={false} runningText='Saving' onClick={() => this.save()}>Set</AjaxButton>
                    <BootstrapButton preset="default" onClick={() => this.closeModal()}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManualBookEntry;