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
                    </tr>
                </thead>
                <tbody>
                { this.props.list.map((book, i) =>
                    <tr key={'bookDesktop' + i}>
                        <td><img src={book.smallImage} /></td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }
}

module.exports = BookViewListDesktop;