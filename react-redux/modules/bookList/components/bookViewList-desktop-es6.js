const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <table className="table table-striped">
                <thead>
                    <th></th>
                    <th>Title</th>
                    <th>Author</th>
                </thead>
                <tbody>
                { this.props.list.map((book, i) =>
                    <tr>
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