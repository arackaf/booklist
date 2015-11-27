class BookViewListDesktop extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Author</th>
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
                        <td>{book.isbn}</td>
                        <td>{book.publicationDate}</td>
                        <td>{book.pages}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }
}

module.exports = BookViewListDesktop;