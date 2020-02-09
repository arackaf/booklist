import React, { createContext, useContext, FunctionComponent, useEffect, Suspense, useState } from "react";
import { render } from "react-dom";
import MainNavigationBar from "app/components/mainNavigation";
import { useAppState, AppState } from "./appState";
import { history, getCurrentHistoryState } from "util/urlHelpers";
import localStorageManager from "util/localStorage";
import Loading from "./components/loading";
import { isLoggedIn } from "util/loginStatus";
import { getModuleComponent } from "../routing";

document.body.className = localStorageManager.get("color-theme", "scheme1");

const MobileMeta = props => {
  const [app] = useContext(AppContext);
  return (
    <meta
      name="viewport"
      content={app.showingMobile ? "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;" : ""}
    />
  );
};

const WellUiSwitcher: FunctionComponent<{}> = props => {
  const [app, { requestDesktop, requestMobile }] = useContext(AppContext);

  const showChooseDesktop = app.isMobile && app.showingMobile;
  const showSwitchBackMobile = app.isMobile && app.showingDesktop;

  return (
    <div id="footer" style={{ position: "fixed", bottom: 0, left: 0, right: 0, marginBottom: 0 }}>
      <i className="fal fa-book" />
      <span style={{ marginLeft: "5px", marginRight: "5px" }}>My Library</span>
      {showChooseDesktop ? <a onClick={requestDesktop}>Use desktop version</a> : null}
      {showSwitchBackMobile ? <a onClick={requestMobile}>Use mobile version</a> : null}
    </div>
  );
};

export function clearUI() {
  render(<div />, document.getElementById("home"));
}

export function renderUI(Component = null) {
  render(<App />, document.getElementById("home"));
}

export const AppContext = createContext<[AppState, any, any]>(null);

const App = () => {
  let appStatePacket = useAppState();
  let [appState, appActions] = appStatePacket;

  let Component = getModuleComponent(appState.module);

  useEffect(() => {
    window.addEventListener("offline", appActions.isOffline);
    window.addEventListener("online", appActions.isOnline);
  }, []);

  return (
    <AppContext.Provider value={appStatePacket}>
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh", margin: "auto" }}>
        <MobileMeta />
        <MainNavigationBar />

        <div id="main-content" style={{ flex: 1, overflowY: "auto" }}>
          <Suspense fallback={<Loading />}>{Component ? <Component /> : null}</Suspense>
        </div>
        <WellUiSwitcher />
      </div>
    </AppContext.Provider>
  );
};

const LoggedInApp = ({ component }) => {};
