import BooksMenuBar from './booklist-menubar/booksMenuBar';
const BootstrapButton = require('root-components/bootstrapButton');

class BookViewListMobileItem extends React.Component{
    constructor(){
        super();
        this.state = { expanded: false };
    }
    toggle(){
        this.setState({ expanded: !this.state.expanded });
    }
    render(){
        return (
            <a onClick={() => this.toggle()} className="list-group-item" style={{ cursor: 'pointer' }}>
                <div className="row">
                    <div className="col-xs-3 col-sm-1">
                        {this.state.expanded || this.props.showImg ? <img src={this.props.smallImage} /> : null}
                    </div>
                    <div className="col-xs-9 col-sm-11">
                        <h4 className="list-group-item-heading">{this.props.title}</h4>
                        <p className="list-group-item-text">{this.props.author || 'no author'}</p>
                        { !this.state.expanded ? null :
                            <div>
                                {this.props.publicationDate ? <p className="list-group-item-text">{'Published ' + this.props.publicationDate}</p> : null}
                                {this.props.pages ? <p className="list-group-item-text">{this.props.pages + ' pages'}</p> : null}
                                {this.props.isbn ? <p className="list-group-item-text">{'ISBN ' + this.props.isbn}</p> : null}
                            </div>
                        }
                    </div>
                </div>
            </a>
        );
    }
}

class BookViewListMobile extends React.Component{
    constructor(){
        super();
        this.state = { showImages: false };
    }
    toggleImages(){
        this.setState({ showImages: !this.state.showImages });
    }
    render(){
        return (
            <div>
                <BooksMenuBar
                    selectedBooksCount={this.props.books.selectedBooksCount}
                    allSubjects={this.props.subjects.list}
                ></BooksMenuBar>

                <div style={{ paddingBottom: 15 }}>
                    <BootstrapButton style={{ margin: 5 }} onClick={() => this.toggleImages()} preset="info-xs">{ this.state.showImages ? 'Hide covers' : 'Show covers' }</BootstrapButton>
                    <div style={{ border: 0 }} className="list-group docked-to-panel">
                        { this.props.books.list.map((book, i) => <BookViewListMobileItem showImg={this.state.showImages} key={book._id} {...book} /> )}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = BookViewListMobile;