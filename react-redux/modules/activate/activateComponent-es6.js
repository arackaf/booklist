import { isLoggedIn, globalHashManager } from 'reactStartup';
import React, {Component} from 'react';

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
        this._timeoutToken = setTimeout(() => globalHashManager.overwriteToNewHash('#home'), 5000);
    }
    componentWillUnmount(){
        clearTimeout(this._timeoutToken);
    }
    render(){
        return (
            <div>
                <MainActivatePane>
                    <div className="alert alert-success">
                        Your account is activated!  Redirecting you automatically, or use the menu above if you don't care to wait :-)
                    </div>
                </MainActivatePane>
            </div>
        )
    }
}

const ActivateIfNotLoggedIn = props => (
    <div>
        <MainActivatePane>
            <div className="alert alert-danger">
                Sorry - it looks like something went wrong. The activation link you clicked appears to be invalid.
            </div>
        </MainActivatePane>
    </div>
);

export default props => (
    <div>
        { isLoggedIn() ? <ActivateIfLoggedIn /> : <ActivateIfNotLoggedIn /> }
    </div>
);