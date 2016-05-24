import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';

const Modal = ReactBootstrap.Modal;

class ManualBookEntry extends React.Component {
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
                            <div className="col-xs-4">
                                <div className="form-group">
                                    <label>Author</label>
                                    <input ref="author" className="form-control" placeholder="Author" />
                                </div>
                            </div>

                            <div className="col-xs-4">
                                <div className="form-group">
                                    <label>Author 2</label>
                                    <input ref="author2" className="form-control" placeholder="Author 2" />
                                </div>
                            </div>
                            <div className="col-xs-4">
                                <div className="form-group">
                                    <label>Author 3</label>
                                    <input ref="author3" className="form-control" placeholder="Author 3" />
                                </div>
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