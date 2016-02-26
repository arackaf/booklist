//just for now - need something to fire off search changes, if for no other reason than to get an initial search up
const BookSearchDesktop = require('./BookSearch-desktop');

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
                <BookSearchDesktop allSubjects={this.props.subjects.list}></BookSearchDesktop>

                <a style={{ cursor: 'pointer' }} onClick={() => this.toggleImages()}>Show images</a>
                <div className="list-group">
                    { this.props.books.list.map((book, i) => <BookViewListMobileItem showImg={this.state.showImages} key={book._id} {...book} /> )}
                </div>
            </div>
        );
    }
}

module.exports = BookViewListMobile;