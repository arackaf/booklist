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

const images = [
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/5df692fae34a83f9c74ac701/converted-cover-file-8f45c617-df5f-455e-aabe-283b945e0499.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/5df692fae34a83f9c74ac701/converted-cover-file-360ddfdd-1d3e-4127-a6b5-39d2c16828b2.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/5df692fae34a83f9c74ac701/converted-cover-file-2d5a7b1d-305e-4b46-8f7d-311ecbcff421.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/file-c426e31e-ef40-42fd-9711-f9a812b27bd3.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-445095c3-2a39-43ca-9bdb-545fb6fbf656.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-a6483ea2-0103-4f2c-becc-3ec7b243d987.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-8bfb15e0-d703-41de-9f64-e49a8dde52b9.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-597ad7e5-e07b-4c62-b616-2e7fc1dfedc1.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-bf6cc05d-43b4-4eab-bdd2-f3decab2c8f2.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-e7c282b5-0a8f-4d66-b78f-0f0fd2094bf4.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-c0bf0ed4-14fd-49d5-bf7f-70c2764728a9.jpg",
  "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/converted-cover-file-6298e002-8584-4c75-b7b1-f9fea8f72b31.jpg",
];
var counter = 0;

ws.onmessage = ({ data }) => {
  let packet = JSON.parse(data);
  console.log(data);
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: packet._messageType, packet } }));
};

setTimeout(() => {
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: "initial", packet: JSON.parse(`{"_messageType":"initial","pending":8}`) } }));
}, 1000);
setInterval(() => {
  let obj = JSON.parse(
    `{"_messageType":"bookAdded","title":"Structure and Interpretation of Computer Programs (MIT Electrical Engineering and Computer Science)","isbn":"0262510871","ean":"","pages":657,"smallImage":"${images[counter++ % images.length]}","mediumImage":"https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/5df692fae34a83f9c74ac701/converted-cover-file-2f89d9ca-2af4-4a7a-91af-30e3ba41f6b9.jpg","publicationDate":"1996-07-25","publisher":"MIT Press","authors":["Harold Abelson","Gerald Jay Sussman","Julie Sussman"],"editorialReviews":[{"source":"Description","content":"<i>Structure and Interpretation of Computer Programs</i> has had a dramatic impact on computer science curricula over the past decade. This long-awaited revision contains changes throughout the text. There are new implementations of most of the major programming systems in the book, including the interpreters and compilers, and the authors have incorporated many small changes that reflect their experience teaching the course at MIT since the first edition was published. A new theme has been introduced that emphasizes the central role played by different approaches to dealing with time in computational models: objects with state, concurrent programming, functional programming and lazy evaluation, and nondeterministic programming. There are new example sections on higher-order procedures in graphics and on applications of stream processing in numerical programming, and many new exercises. In addition, all the programs have been reworked to run in any Scheme implementation that adheres to the IEEE standard."}],"subjects":[],"userId":"5df692fae34a83f9c74ac701","_id":"5f346bdd065d1d457c18c83c","saveMessage":"saved"}`
  );
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { type: "bookAdded", packet: obj } }));
}, 2000);

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
