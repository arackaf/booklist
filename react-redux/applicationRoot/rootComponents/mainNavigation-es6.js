class MainNavigationBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">

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
