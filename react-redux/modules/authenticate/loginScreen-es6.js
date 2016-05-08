import { loadCurrentModule, goHome } from 'react-startup';
import AjaxButton from 'root-components/ajaxButton';

const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

const errorCodes = {
    s1: 'This user already exists',
    c1: 'Passwords do not match',
    c2: 'No login found for this Email / Password',
    c3: 'Password is required'
}

class Login extends React.Component{
    constructor(){
        super();
        this.state = { newUser: false, errorCode: null };
    }
    login(evt){
        evt.preventDefault();

        let username = this.refs.username.value,
            password = this.refs.password.value,
            rememberme = this.refs.rememberme.checked ? 1 : 0;

        this.setState({ running: true });
        ajaxUtil.post('/react-redux/login', { username, password, rememberme }, loadCurrentModule, () => this.setState({ running: false, errorCode: 'c2' }));
    }
    createUser(evt){
        evt.preventDefault();

        let username = this.refs.username.value,
            password = this.refs.password.value,
            confirmPassword = this.refs.confirmPassword.value,
            rememberme = this.refs.rememberme.checked ? 1 : 0;

        if (password !== confirmPassword){
            this.setState({ errorCode: 'c1' });
            return;
        } else if (!password){
            this.setState({ errorCode: 'c3' });
            return;
        } else {
            this.setState({ errorCode: null });
        }

        this.setState({ running: true });
        ajaxUtil.post('/react-redux/createUser', { username, password, rememberme }, resp => {
            if (resp.errorCode){
                this.setState({ errorCode: resp.errorCode, running: false });
            } else {
                ajaxUtil.post('/react-redux/login', { username, password, rememberme }, () => {
                    window.location.hash = '#books'; //new user - send them to where they can enter some books
                });
            }
        });
    }
    switchToLogin(){
        this.setState({ newUser: false, errorCode: null });
    }
    switchToCreate(){
        this.setState({ newUser: true, errorCode: null });
    }
    render(){
        return (
            <div>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a onClick={goHome} style={{ cursor: 'default' }}>My Library</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                </Navbar>
                <div style={{ padding: 50, maxWidth: 700, marginRight: 'auto', marginLeft: 'auto'}}>
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="username">Email address</label>
                                    <input className="form-control" ref="username" id="username" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input className="form-control" ref="password" id="password" type="password" />
                                </div>

                                { this.state.newUser ?
                                    <div className="form-group">
                                        <label htmlFor="password">Confirm password</label>
                                        <input className="form-control" ref="confirmPassword" type="password" />
                                    </div> : null
                                }

                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" ref="rememberme" /> Remember me
                                    </label>
                                </div>
                                { this.state.newUser ?

                                    <AjaxButton onClick={evt => this.createUser(evt)} running={this.state.running} preset="primary">Create user</AjaxButton>
                                    : <AjaxButton onClick={evt => this.login(evt)} running={this.state.running} preset="primary">Login</AjaxButton>
                                }
                                { this.state.errorCode ?
                                    <div className="alert alert-danger margin-top">
                                        {errorCodes[this.state.errorCode]}
                                    </div> : null }
                                <hr />

                                { this.state.newUser ?

                                    <div className="form-group">
                                        <h4>Existing user?</h4>
                                        <a onClick={() => this.switchToLogin()} className="btn btn-info">Click to login</a>
                                    </div>
                                    :
                                    <div className="form-group">
                                        <h4>New user?</h4>
                                        <a onClick={() => this.switchToCreate()} className="btn btn-info">Click to create account</a>
                                    </div>

                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;