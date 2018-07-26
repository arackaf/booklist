import React from "react";
import { Provider, connect } from "react-redux";
import Header from "./components/header";
import { store } from "./store";
import { render } from "react-dom";
import { requestDesktop, requestMobile } from "./rootReducerActionCreators";
import MainNavigationBar from "applicationRoot/components/mainNavigation";

const MobileMeta = connect(
  state => state.app,
  {}
)(app => (
  <meta
    name="viewport"
    content={app.showingMobile ? "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;" : ""}
  />
));

const WellUiSwitcher = connect(
  state => state.app,
  { requestDesktop, requestMobile }
)(props => {
  let showChooseDesktop = props.isMobile && props.showingMobile,
    showSwitchBackMobile = props.isMobile && props.showingDesktop;

  return (
    <div className="well well-sm" style={{ position: "fixed", bottom: 0, left: 0, right: 0, marginBottom: 0 }}>
      <img width="16" height="16" src="/react-redux/static/main-icon2.png" />
      <span style={{ marginLeft: "5px", marginRight: "5px" }}>My Library</span>
      {showChooseDesktop ? <a onClick={props.requestDesktop}>Use desktop version</a> : null}
      {showSwitchBackMobile ? <a onClick={props.requestMobile}>Use mobile version</a> : null}
    </div>
  );
});

export function clearUI() {
  render(<div />, document.getElementById("home"));
}

export function renderUI(component) {
  render(
    <Provider store={store as any}>
      <div>
        <MobileMeta />
        <MainNavigationBar />
        <div style={{ marginTop: 60 }}>{component}</div>
        <WellUiSwitcher />
      </div>
    </Provider>,
    document.getElementById("home")
  );
}
