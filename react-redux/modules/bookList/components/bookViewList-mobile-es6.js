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
                <h4 className="list-group-item-heading">{this.props.title}</h4>
                <p className="list-group-item-text">{this.props.author || 'no author'}</p>
                { !this.state.expanded ? null :
                    <div>
                        {this.props.publicationDate ? <p className="list-group-item-text">{'Published ' + this.props.publicationDate}</p> : null}
                        {this.props.pages ? <p className="list-group-item-text">{this.props.pages + ' pages'}</p> : null}
                        {this.props.isbn ? <p className="list-group-item-text">{'ISBN ' + this.props.isbn}</p> : null}
                    </div>
                }
            </a>
        );
    }
}

class BookViewListMobile extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div className="list-group">
                { this.props.list.map((book, i) => <BookViewListMobileItem key={'book' + i} {...book} /> )}
            </div>
        );
    }
}

module.exports = BookViewListMobile;