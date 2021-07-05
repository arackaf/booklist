import React, { createContext, useContext, FunctionComponent, useEffect, Suspense, useMemo } from "react";
const { unstable_useTransition: useTransition } = React as any;

import ReactDOM from "react-dom";
const { unstable_createRoot: createRoot } = ReactDOM as any;

import MainNavigationBar from "app/components/mainNavigation";
import { useAppState, AppState, URL_SYNC, getCurrentModuleFromUrl } from "./state/appState";
import localStorageManager from "util/localStorage";
import Loading, { LongLoading } from "./components/loading";
import { getModuleComponent } from "./routing";
import { history, getCurrentUrlState } from "util/urlHelpers";

import scanWebSocket from "util/scanWebSocket";
import { getCookieLookup, isLoggedIn } from "util/loginStatus";

document.body.className = localStorageManager.get("color-theme", "scheme1");

const cookieHash = getCookieLookup();

if (isLoggedIn()) {
  scanWebSocket.open();
  scanWebSocket.send({ action: "sync", userId: cookieHash.userId, loginToken: cookieHash.loginToken });

  scanWebSocket.addHandler(({ data }) => {
    let packet = JSON.parse(data);
    console.log(data);
    //window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: packet._messageType, packet } }));
  });
}

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
    <footer>
      <i className="fal fa-book" />
      <span style={{ marginLeft: "5px", marginRight: "5px" }}>My Library</span>
      {showChooseDesktop ? <a onClick={requestDesktop}>Use desktop version</a> : null}
      {showSwitchBackMobile ? <a onClick={requestMobile}>Use mobile version</a> : null}
    </footer>
  );
};

export function renderUI() {
  createRoot(document.getElementById("home")).render(<App />);
}

export const AppContext = createContext<[AppState, any, any]>(null);
export const ModuleUpdateContext = createContext<{ startTransition: any; isPending: boolean }>(null);

const App = () => {
  const suspenseTimeoutValue = parseInt(localStorage.getItem("suspense-timeout"));
  const timeoutMs = isNaN(suspenseTimeoutValue) ? 3000 : suspenseTimeoutValue;
  const [startTransitionNewModule, isNewModulePending] = useTransition({ timeoutMs });
  const [startTransitionModuleUpdate, moduleUpdatePending] = useTransition({ timeoutMs });

  const suspensePacket = useMemo(
    () => ({ startTransition: startTransitionModuleUpdate, isPending: moduleUpdatePending }),
    [startTransitionModuleUpdate, moduleUpdatePending]
  );

  let appStatePacket = useAppState();
  let [appState, appActions, dispatch] = appStatePacket;

  let Component = getModuleComponent(appState.module) as any;

  useEffect(() => {
    startTransitionNewModule(() => {
      dispatch({ type: URL_SYNC });
    });

    document.documentElement.scrollTop = 0;
    if (appState.isMobile) {
      function setAdjustedVh() {
        let vh = window.innerHeight * 0.01 + "px";
        document.documentElement.style.setProperty("--adjusted-vh", vh);
      }

      window.addEventListener("resize", setAdjustedVh);

      let pinching = false;
      window.addEventListener("gesturestart", () => {
        pinching = true;
      });
      window.addEventListener("gestureend", () => {
        pinching = false;
        setTimeout(() => setAdjustedVh(), 1);
        setTimeout(() => setAdjustedVh(), 100);
        setTimeout(() => setAdjustedVh(), 250);
        setTimeout(() => setAdjustedVh(), 750);
      });
      setAdjustedVh();
      setTimeout(setAdjustedVh, 10); //Chrome iOS
      setTimeout(setAdjustedVh, 100);
      setTimeout(setAdjustedVh, 250);
    }
  }, []);
  useEffect(() => {
    return history.listen(location => {
      let urlState = getCurrentUrlState();
      let publicUserId = urlState.searchState.userId;

      //changing public viewing status - reload page
      if (publicUserId != appState.publicUserId) {
        return location.reload();
      }

      if (appState.module != getCurrentModuleFromUrl()) {
        startTransitionNewModule(() => {
          dispatch({ type: URL_SYNC });
        });
      } else {
        startTransitionModuleUpdate(() => {
          dispatch({ type: URL_SYNC });
        });
      }
    });
  }, [appState.module]);

  useEffect(() => {
    window.addEventListener("offline", appActions.isOffline);
    window.addEventListener("online", appActions.isOnline);
  }, []);

  return (
    <AppContext.Provider value={appStatePacket}>
      <ModuleUpdateContext.Provider value={suspensePacket}>
        <MobileMeta />
        {isNewModulePending ? <Loading /> : null}
        <div style={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
          <div id="app">
            <MainNavigationBar />

            <Suspense fallback={<LongLoading />}>
              {Component ? (
                <main>
                  <Component updating={moduleUpdatePending} />
                  {appState.isMobile ? <WellUiSwitcher /> : null}
                </main>
              ) : null}
            </Suspense>

            {!appState.isMobile ? <WellUiSwitcher /> : null}
          </div>
        </div>
      </ModuleUpdateContext.Provider>
    </AppContext.Provider>
  );
};
