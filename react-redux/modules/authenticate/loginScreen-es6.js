import reactStartup from 'react-redux/reactStartup';

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

        ajaxUtil.post('/react-redux/login', { username, password, rememberme }, resp => {
            reactStartup.loadCurrentModule();
        });
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
        } else {
            this.setState({ errorCode: null });
        }

        ajaxUtil.post('/react-redux/createUser', { username, password, rememberme }, resp => {
            if (resp.errorCode){
                this.setState({ errorCode: resp.errorCode });
            } else {
                ajaxUtil.post('/react-redux/login', { username, password, rememberme }, () => {
                    window.location.hash = '#bookEntry'; //new user - send them to where they can enter some books
                });
            }
        });
    }
    switchToLogin(){
        this.setState({ newUser: false });
    }
    switchToCreate(){
        this.setState({ newUser: true });
    }
    render(){
        return (
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

                                <button onClick={evt => this.createUser(evt)} className="btn btn-primary">Create user</button>
                                : <button onClick={evt => this.login(evt)} className="btn btn-primary">Login</button>
                            }
                            { this.state.errorCode == 's1' ?
                                <div className="alert alert-danger margin-top">
                                    This user already exists
                                </div> : null }
                            { this.state.errorCode == 'c1' ?
                                <div className="alert alert-danger margin-top">
                                    Passwords do not match
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
        );
    }
}

export default Login;