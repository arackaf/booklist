import React, { createContext, useContext, FunctionComponent, useEffect, Suspense, useState, lazy } from "react";
const { useTransition } = React as any;

import ReactDOM from "react-dom";
const { createRoot } = ReactDOM as any;
import MainNavigationBar from "app/components/mainNavigation";
import { useAppState, AppState, getCurrentModule } from "./appState";
import localStorageManager from "util/localStorage";
import Loading from "./components/loading";
import { getModuleComponent } from "../routing";
import { history, getCurrentHistoryState } from "util/urlHelpers";

document.body.className = localStorageManager.get("color-theme", "scheme1");

const MobileMeta = () => {
  const [app] = useContext(AppContext);
  return (
    <meta
      name="viewport"
      content={app.showingMobile ? "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0; user-scalable=0;" : ""}
    />
  );
};

const WellUiSwitcher: FunctionComponent<{}> = () => {
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

export function renderUI() {
  createRoot(document.getElementById("home")).render(<App />);
}

export const AppContext = createContext<[AppState, any, any]>(null);

const App = () => {
  const [startTransition, isPending] = useTransition({ timeoutMs: 4000 });
  let appStatePacket = useAppState();
  let [appState, appActions, dispatch] = appStatePacket;

  let Component = getModuleComponent(appState.module);

  useEffect(() => {
    history.listen(location => {
      let publicUserId = getCurrentHistoryState().searchState.userId;

      //changing public viewing status - reload page
      if (publicUserId != appState.publicUserId) {
        return location.reload();
      }

      startTransition(() => {
        dispatch({ type: "root.SET_MODULE", module: getCurrentModule() });
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("offline", appActions.isOffline);
    window.addEventListener("online", appActions.isOnline);
  }, []);

  return (
    <AppContext.Provider value={appStatePacket}>
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh", margin: "auto" }}>
        <MobileMeta />
        <MainNavigationBar />

        {isPending ? <Loading /> : null}
        <Suspense fallback={<Loading />}>
          <div id="main-content" style={{ flex: 1, overflowY: "auto" }}>
            {Component ? <Component /> : null}
          </div>
        </Suspense>

        <WellUiSwitcher />
      </div>
    </AppContext.Provider>
  );
};

const MainContent = ({ Component }) => (
  <div id="main-content" style={{ flex: 1, overflowY: "auto" }}>
    {Component ? <Component /> : null}
  </div>
);
