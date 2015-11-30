const Modal = ReactBootstrap.Modal;

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { subjectsModalShown: false, editSubjectsFor: null };
    }
    componentWillReceiveProps(newProps){
        this.setState({ subjectsModalShown: newProps.editSubjectsAtIndex >= 0, editSubjectsFor: newProps.bookList[newProps.editSubjectsAtIndex] || {} });
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
                    { this.props.bookList.map((book, i) =>
                        <tr key={'bookDesktop' + i}>
                            <td><img src={book.smallImage} /></td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                { book.subjects.map(s => <li key={s._id}>{s.name}</li>) }
                                <button onClick={() => this.props.editSubjectsFor(i)}>Open</button>
                            </td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                            <td>{book.pages}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <Modal show={this.state.subjectsModalShown} onHide={() => this.props.editSubjectsFor(-1)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            <li>History <button onClick={() => this.props.addSubject('History')}>add</button></li>
                            <li>Science <button onClick={() => this.props.addSubject('Science')}>add</button></li>
                            <li>Math <button onClick={() => this.props.addSubject('Math')}>add</button></li>
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onHide={() => this.props.editSubjectsFor(-1)}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = BookViewListDesktop;