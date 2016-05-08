import { isLoggedIn, goHome } from 'react-startup';

const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;
import MainNavigationBar from 'root-components/mainNavigation';

class HomeIfLoggedIn extends React.Component{
    render(){
        return (
            <div>
                <MainNavigationBar></MainNavigationBar>
                <div>You're logged in.  Use the menu ago to go somewhere useful.  Eventually there'll be some sort of dashboard here.</div>
            </div>
        )
    }
}

class HomeIfNotLoggedIn extends React.Component{
    render(){
        return (
            <div>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a style={{ cursor: 'default' }}>Book Tracker</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href='#login'>Login</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div>Welcome to My-Library.  Use this site to blah blah blah. More complete description coming</div>
            </div>
        )
    }
}

class Home extends React.Component{
    constructor(){
        super();
        this.state = { isLoggedIn: isLoggedIn() };
    }
    render(){
        return (
            <div>
                { this.state.isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn /> }
            </div>
        );
    }
}

export default Home;