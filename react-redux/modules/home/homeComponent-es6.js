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

                <div className="row">
                    <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
                    <div style={{ marginLeft: 10, marginRight: 10 }} className="col-md-10 col-lg-6">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                Welcome to <i>My Library</i>.  Eventually there'll be some sort of interesting dashboard here.  Until then, just use the menu above
                                to either view your library, or scan some books in.
                            </div>
                        </div>
                    </div>
                    <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
                </div>
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