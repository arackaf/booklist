import { history, getCurrentHistoryState } from "reactStartup";
import React, { Component } from "react";
import { isLoggedIn } from "applicationRoot/rootReducer";

const MainActivatePane = props => (
  <div className="row" style={{ margin: 0 }}>
    <div className="hidden-xs hidden-sm col-md-1 col-lg-3" />
    <div style={{ marginLeft: 10, marginRight: 10 }} className="col-md-10 col-lg-6">
      <div className="panel panel-default">
        <div className="panel-body">{props.children}</div>
      </div>
    </div>
    <div className="hidden-xs hidden-sm col-md-1 col-lg-3" />
  </div>
);

class ActivateIfLoggedIn extends Component<any, any> {
  _timeoutToken = setTimeout(() => history.replace("/home"), 5000);

  componentWillUnmount() {
    clearTimeout(this._timeoutToken);
  }
  render() {
    return (
      <div>
        <MainActivatePane>
          <div className="alert alert-success">
            Your account is activated! Redirecting you automatically, or use the menu above if you don't care to wait :-)
          </div>
        </MainActivatePane>
      </div>
    );
  }
}

const ActivateIfNotLoggedIn = props => {
  let alreadyActivated = !!getCurrentHistoryState().searchState.alreadyActivated;
  return (
    <div>
      <MainActivatePane>
        {alreadyActivated ? (
          <div className="alert alert-warning">This activation link has already been used. Use the login link above to log back in.</div>
        ) : (
          <div className="alert alert-danger">Sorry - it looks like something went wrong. The activation link you clicked appears to be invalid.</div>
        )}
      </MainActivatePane>
    </div>
  );
};

export default props => <div>{isLoggedIn() ? <ActivateIfLoggedIn /> : <ActivateIfNotLoggedIn />}</div>;
