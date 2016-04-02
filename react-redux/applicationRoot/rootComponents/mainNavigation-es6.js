const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

class MainNavigationBar extends React.Component {
    logout(){
        alert('log out');
    }
    render() {
        return (
            <Navbar fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a style={{ cursor: 'default' }}>Book Tracker</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem href={this.props.isBookEntry ? undefined : '#bookEntry'}>Book entry</NavItem>
                        <NavItem href={this.props.isBookList ? undefined : '#bookList'}>Your books</NavItem>
                        <NavItem onClick={this.logout}>Logout</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainNavigationBar;
