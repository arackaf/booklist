class Login extends React.Component{
    render(){
        return (
            <div style={{ padding: 50, maxWidth: 700, marginRight: 'auto', marginLeft: 'auto'}}>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input className="form-control" id="username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input className="form-control" id="password" type="password" />
                            </div>

                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" /> Remember me
                                </label>
                            </div>
                            <button className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;