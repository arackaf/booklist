import reactStartup from 'react-redux/reactStartup';

const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

class MainNavigationBar extends React.Component {
    logout(){
        ajaxUtil.post('/react-redux/logout', { }, () => reactStartup.forceLogin());
    }
    render() {
        let isBookEntry = this.props.isBookEntry,
            isBookList = this.props.isBookList;

        return (
            <Navbar style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0 }} fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a style={{ cursor: 'default' }}>Book Tracker</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem active={isBookEntry} href={isBookEntry ? undefined : '#bookEntry'}>Book entry</NavItem>
                        <NavItem active={isBookList} href={isBookList ? undefined : '#books'}>Your books</NavItem>
                        <NavItem onClick={this.logout}>Logout</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MainNavigationBar;
