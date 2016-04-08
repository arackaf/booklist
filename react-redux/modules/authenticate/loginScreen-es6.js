import reactStartup from 'react-redux/reactStartup';

class Login extends React.Component{
    login(){
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let rememberme = this.refs.rememberme.checked ? 1 : 0;

        ajaxUtil.post('/react-redux/login', { username, password, rememberme }, resp => {
            reactStartup.loadCurrentModule();
        });
    }
    render(){
        return (
            <div style={{ padding: 50, maxWidth: 700, marginRight: 'auto', marginLeft: 'auto'}}>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input className="form-control" ref="username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input className="form-control" ref="password" type="password" />
                            </div>

                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" ref="rememberme" /> Remember me
                                </label>
                            </div>
                            <button onClick={this.login.bind(this)} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;