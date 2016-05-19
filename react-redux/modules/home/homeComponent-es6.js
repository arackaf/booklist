import { isLoggedIn, goHome } from 'react-startup';

const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;
import MainNavigationBar from 'root-components/mainNavigation';

import DropzoneRoot from 'react-redux-util/react-dropzone';

const Dropzone = DropzoneRoot.Dropzone;

const MainHomePane = props =>
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

class HomeIfLoggedIn extends React.Component{
    onDrop(files) {
        console.log('Received files: ', files);

        let request = new FormData();
        request.append('fileUploaded', files[0]);
        request.append('devName', 'Why, Adam Rackis, of course');

        debugger;

        ajaxUtil.post('/react-redux/upload', request);
    }
    render(){
        return (
            <div>
                <MainNavigationBar></MainNavigationBar>
                <MainHomePane>
                    Welcome to <i>My Library</i>.  Eventually there'll be some sort of interesting dashboard here.  Until then, just use the menu above
                    to either view your library, or scan some books in.
                    <br />
                    <br />

                    <div>
                        <Dropzone  onDrop={this.onDrop} multiple={false}>
                            <div>Try dropping some files here, or click to select files to upload.</div>
                        </Dropzone>
                    </div>

                </MainHomePane>
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
                <MainHomePane>
                    Welcome to <i>My Library</i>.
                    <br /><br />
                    This site is my own little passion project, the purpose of which is to track your library.  You scan in your books (or manually type in the isbn)
                    and the books' info is fetched from Amazon, and stored for you.  You can then flexibly search and categorize your library.
                    <br /><br />
                    So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot,
                    own the books they read, and read non-eBooks.  As I said, this is more of a passion project than anything.
                    <br /><br />
                    It's free to sign up, and store up to 500 books.  In the remote chance someone actually wants to store more than that, there'll be some sort
                    of nominal fee to help defray storage costs.
                    <br /><br />
                    <a className="btn btn-primary" href="#login">Login or create an account</a>
                </MainHomePane>
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