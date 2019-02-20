import React, { createContext, useState, useEffect } from "react";
import { Provider, connect } from "react-redux";
import { store } from "./store";
import { render } from "react-dom";
import { requestDesktop, requestMobile } from "./rootReducerActionCreators";
import MainNavigationBar from "applicationRoot/components/mainNavigation";
import { useAppState, AppState } from "./appState";
import { useColors } from "./colorsState";
import { SubjectState, useSubjectsState } from "./subjectsState";

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
  render(<App component={component} />, document.getElementById("home"));
}

export const AppContext = createContext<[AppState, any, any]>(null);
export const ColorsContext = createContext<any>(null);
export const SubjectsContext = createContext<[SubjectState, any]>(null);

const App = ({ component }) => {
  let appStatePacket = useAppState();
  let [appState] = appStatePacket;

  let subjectsPacket = useSubjectsState(appState);
  const colorsPacket = useColors();

  return (
    <Provider store={store as any}>
      <SubjectsContext.Provider value={subjectsPacket}>
        <ColorsContext.Provider value={colorsPacket}>
          <AppContext.Provider value={appStatePacket}>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh", margin: "auto" }}>
              <MobileMeta />
              <MainNavigationBar />

              <div id="main-content" style={{ flex: 1, overflowY: "auto" }}>
                {component}
                <div style={{ visibility: "hidden" }}>
                  <button>
                    <i className="fa fa-fw fa-spin fa-spinner" />
                  </button>
                </div>
              </div>
              <WellUiSwitcher />
            </div>
          </AppContext.Provider>
        </ColorsContext.Provider>
      </SubjectsContext.Provider>
    </Provider>
  );
};
