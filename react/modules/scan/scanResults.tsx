import React, { FunctionComponent, useEffect, useState, useReducer, Suspense } from "react";

import { useTransition, config, animated } from "react-spring";
import { SlideInContents } from "app/animationHelpers";
import { CoverSmall } from "app/components/bookCoverComponent";

function scanReducer(state, [type, payload]) {
  switch (type) {
    case "pendingCountSet":
    case "bookQueued":
      return { ...state, pending: payload };
    case "scanResults":
      const newItems = payload.results.map(result => ({ success: result.success, ...result.item }));
      return { ...state, booksSaved: newItems.concat(state.booksSaved).slice(0, 25) };
  }
  return state;
}

const ScanResults: FunctionComponent<{}> = props => {
  const [showIncomingQueue, setShowIncomingQueue] = useState(false);
  const [{ pending, booksSaved: booksJustSaved }, dispatch] = useReducer(scanReducer, { pending: 0, booksSaved: [] });

  const toggleIncomingQueue = () => setShowIncomingQueue(!showIncomingQueue);

  const toggleClass = showIncomingQueue ? "fa-angle-double-up" : "fa-angle-double-down";

  const toggleShow =
    booksJustSaved.length || pending ? (
      <a onClick={() => toggleIncomingQueue()} className="margin-left-xs">
        <i style={{ color: "white" }} className={`far fa-white ${toggleClass}`} />
      </a>
    ) : null;

  const booksJustSavedTransition = useTransition(booksJustSaved, {
    config: config.stiff,
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  useEffect(() => {
    function sendIt({ detail }: any) {
      dispatch([detail.type, detail.pendingCount ?? detail.packet]);
    }

    window.addEventListener("ws-info", sendIt);
    window.dispatchEvent(new CustomEvent("sync-ws"));
    return () => window.removeEventListener("ws-info", sendIt);
  }, []);

  const labelScanStatusStyles = !!toggleShow ? { display: "inline-block", width: "30ch" } : {};

  return (
    <div style={{ flex: 1 }}>
      <div>
        {pending == null ? null : pending ? (
          <span className="label label-info">
            <span style={labelScanStatusStyles}>{`${pending} Book${pending === 1 ? "" : "s"} currently outstanding`}</span>
            {toggleShow}
          </span>
        ) : (
          <span className="label label-success">
            <span style={labelScanStatusStyles}>All pending books saved&nbsp;</span>
            {toggleShow}
          </span>
        )}
      </div>

      <SlideInContents clamp={true} in={showIncomingQueue} immediateChanges={true} opacity={true} style={{ marginTop: "10px" }}>
        <div className="alert alert-info alert-slim" style={{ marginBottom: "15px" }}>
          Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a dedicated place to
          see what's been saved, and what failed to be found.
        </div>

        <div style={{ marginBottom: 0 }}>
          {booksJustSavedTransition((styles, book) => (
            <Suspense fallback={null}>
              <div className="auto-fade-in margin-bottom">
                <animated.div
                  className="border-bottom padding-bottom"
                  style={{ display: "flex", flexDirection: "row", color: book.success ? "var(--neutral-text)" : "red", ...styles }}
                >
                  <div style={{ minWidth: "90px" }}>
                    <CoverSmall url={book.smallImage} />
                  </div>
                  <span>{book.title}</span>
                </animated.div>
              </div>
            </Suspense>
          ))}
        </div>
      </SlideInContents>
    </div>
  );
};

export default ScanResults;
