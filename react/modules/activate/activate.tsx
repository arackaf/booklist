import { history } from "util/urlHelpers";
import React, { Component, SFC, useContext } from "react";
import { AppContext } from "app/renderUI";
import FlexRow from "app/components/layout/FlexRow";

const MainActivatePane = props => (
  <FlexRow>
    <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "40px" }} className="col-xs-11 col-md-10 col-lg-6">
      <div>
        <div>{props.children}</div>
      </div>
    </div>
  </FlexRow>
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
  let [appState] = useContext(AppContext);
  let alreadyActivated = !!appState.urlState.searchState.alreadyActivated;
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

const ActivationComponent: SFC<{}> = props => {
  const [{ isLoggedIn }] = useContext(AppContext);
  return <section>{isLoggedIn ? <ActivateIfLoggedIn /> : <ActivateIfNotLoggedIn />}</section>;
};

export default ActivationComponent;
