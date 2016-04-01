class MainNavigationBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a style={{ cursor: 'default' }} className="navbar-brand visible-xs-block visible-md-block">Brand</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className={this.props.isBookEntry ? 'active' : ''}><a href={this.props.isBookEntry ? undefined : '#bookEntry'}>Book entry</a></li>
                            <li className={this.props.isBookList ? 'active' : ''}><a href={this.props.isBookList ? undefined : '#bookList'}>You books</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default MainNavigationBar;
