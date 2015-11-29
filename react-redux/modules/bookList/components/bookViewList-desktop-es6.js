const Modal = ReactBootstrap.Modal;

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { modalShown: false, editSubjectsFor: null };
    }
    openModal(){
        this.setState({ modalShown: true });
    }
    closeSubjectsModal(){
        this.setState({ modalShown: false });
    }
    render(){
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genres</th>
                            <th>ISBN</th>
                            <th>Published</th>
                            <th>Pages</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.props.list.map((book, i) =>
                        <tr key={'bookDesktop' + i}>
                            <td><img src={book.smallImage} /></td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td><button onClick={() => this.openModal()}>Open</button></td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                            <td>{book.pages}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <Modal show={this.state.modalShown} onHide={() => this.closeSubjectsModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Text in a modal</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onHide={() => this.closeSubjectsModal()}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = BookViewListDesktop;