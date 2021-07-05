import React, { FunctionComponent, useRef, useImperativeHandle, forwardRef, useState, useLayoutEffect } from "react";
import ajaxUtil from "util/ajaxUtil";
import { getLoginStatus } from "util/loginStatus";

const BookEntryItem: FunctionComponent<any> = forwardRef((props, ref) => {
  const inputEl = useRef(null);
  useImperativeHandle(ref, () => ({
    focusInput() {
      inputEl.current.focus();
    },
    selectInput() {
      inputEl.current.select();
    }
  }));

  const [queuing, setQueuing] = useState(false);
  const [queued, setQueued] = useState(false);

  const mounted = useRef(true);

  useLayoutEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      props.entryFinished(inputEl.current.value);

      const isbn = inputEl.current.value;
      if (isbn.length == 10 || isbn.length == 13) {
        setQueuing(true);
        Promise.resolve(ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn, ...getLoginStatus() })).then(() => {
          setQueuing(false);
          setQueued(true);
          setTimeout(() => {
            if (mounted.current) {
              setQueued(false);
              inputEl.current.value = "";
            }
          }, 1500);
        });
      }
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <div>
        <label className="control-label" style={{ marginRight: "5px" }}>
          ISBN
        </label>
      </div>
      <input style={{ maxWidth: "250px" }} className="form-control" ref={inputEl} onKeyDown={keyDown} disabled={props.disable} />
      {queuing ? <span className="label label-default margin-left">Queuing</span> : null}
      {queued ? <span className="label label-success margin-left">Queued</span> : null}
    </div>
  );
});

export default BookEntryItem;
