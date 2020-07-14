import React, { FunctionComponent, useEffect, useRef, useState, useReducer } from "react";

import { useSpring, useTransition, config, animated } from "react-spring";
import { SlideInContents } from "app/animationHelpers";

declare var webSocketAddress: any;

function scanReducer(state, [type, payload]) {
  switch (type) {
    case "initial":
      return { ...state, pending: payload.pending };
    case "pendingBookAdded":
      return { ...state, pending: state.pending + 1 };
    case "bookAdded":
      window.dispatchEvent(new Event("book-scanned"));
      return { ...state, pending: state.pending - 1, booksSaved: [{ success: true, ...payload }].concat(state.booksSaved).slice(0, 15) };
    case "bookLookupFailed":
      let failure = { _id: "" + new Date(), title: `Failed lookup for ${payload.isbn}`, success: false };
      return { ...state, pending: state.pending - 1, booksSaved: [failure].concat(state.booksSaved).slice(0, 15) };
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
        <i style={{ color: "white" }} className={`fa fa-white ${toggleClass}`} />
      </a>
    ) : null;

  const booksJustSavedTransition = useTransition(booksJustSaved, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  let ws: any = null;

  useEffect(() => {
    ws = new WebSocket(webSocketAddress("/bookEntryWS"));

    ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data);
      dispatch([packet._messageType, packet]);
    };

    return () => {
      try {
        ws.close();
      } catch (e) {}
    };
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <div>
        {pending == null ? null : pending ? (
          <span className="label label-info">
            {`${pending} Book${pending === 1 ? "" : "s"} currently outstanding`} {toggleShow}
          </span>
        ) : (
          <span className="label label-success">All pending books saved {toggleShow}</span>
        )}
      </div>

      <SlideInContents in={showIncomingQueue} opacity={true} style={{ marginTop: "10px" }}>
        <div className="alert alert-info alert-slim" style={{ marginBottom: "15px" }}>
          Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a dedicated place to
          see what's been saved, and what failed to be found.
        </div>

        <ul style={{ marginBottom: 0 }}>
          {booksJustSavedTransition((styles, book) => (
            <animated.li style={{ color: book.success ? "green" : "red", ...styles }}>{book.title}</animated.li>
          ))}
        </ul>
      </SlideInContents>
    </div>
  );
};

export default ScanResults;
