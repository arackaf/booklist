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

document.body.className = localStorageManager.get("color-theme", "scheme1");

declare var webSocketAddress: any;
let ws = new WebSocket(webSocketAddress("/bookEntryWS"));

ws.onmessage = ({ data }) => {
  let packet = JSON.parse(data);
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: packet._messageType, packet } }));
};

window.addEventListener("sync-ws", () => {
  ws.send(`SYNC`);
});

window.onbeforeunload = function () {
  ws.onclose = function () {}; // disable onclose handler first
  ws.close();
};

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

  const suspensePacket = useMemo(() => ({ startTransition: startTransitionModuleUpdate, isPending: moduleUpdatePending }), [
    startTransitionModuleUpdate,
    moduleUpdatePending
  ]);

  let appStatePacket = useAppState();
  let [appState, appActions, dispatch] = appStatePacket;

  let Component = getModuleComponent(appState.module) as any;

  useEffect(() => {
    startTransitionNewModule(() => {
      dispatch({ type: URL_SYNC });
    });
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
                </main>
              ) : null}
            </Suspense>

            <WellUiSwitcher />
          </div>
        </div>
      </ModuleUpdateContext.Provider>
    </AppContext.Provider>
  );
};
