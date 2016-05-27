import { isLoggedIn, globalHashManager } from 'react-startup';

const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;
import MainNavigationBar from 'root-components/mainNavigation';

const MainActivatePane = props =>
    <div className="row">
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
        <div style={{ marginLeft: 10, marginRight: 10 }} className="col-md-10 col-lg-6">
            <div className="panel panel-default">
                <div className="panel-body">
                    {props.children}
                </div>
            </div>
        </div>
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
    </div>

class ActivateIfLoggedIn extends React.Component{
    constructor(){
        super();
        this.state = {};
        this._timeoutToken = setTimeout(() => globalHashManager.overwriteToNewHash('#home'), 5000);
    }
    componentWillUnmount(){
        clearTimeout(this._timeoutToken);
    }
    render(){
        return (
            <div>
                <MainNavigationBar></MainNavigationBar>
                <MainActivatePane>
                    <div className="alert alert-success">
                        Your account is activated!  Redirecting you automatically, or use the menu above if you don't care to wait :-)
                    </div>
                </MainActivatePane>
            </div>
        )
    }
}

class ActivateIfNotLoggedIn extends React.Component{
    render(){
        return (
            <div>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a style={{ cursor: 'default' }}>My Library</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href='#login'>Login</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <MainActivatePane>
                    <div className="alert alert-danger">
                        Sorry - it looks like something went wrong. The activation link you clicked appears to be invalid.
                    </div>
                </MainActivatePane>
            </div>
        )
    }
}

class Activate extends React.Component{
    constructor(){
        super();
        this.state = { isLoggedIn: isLoggedIn() };
    }
    render(){
        return (
            <div>
                { this.state.isLoggedIn ? <ActivateIfLoggedIn /> : <ActivateIfNotLoggedIn /> }
            </div>
        );
    }
}

export default Activate;