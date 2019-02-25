import React, { FunctionComponent, useRef, useImperativeHandle, forwardRef, useState } from "react";
import ajaxUtil from "util/ajaxUtil";

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

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      props.entryFinished(inputEl.current.value);

      const isbn = inputEl.current.value;
      if (isbn.length == 10 || isbn.length == 13) {
        setQueuing(true);
        Promise.resolve(ajaxUtil.post("/book/saveFromIsbn", { isbn })).then(() => {
          setQueuing(false);
          setQueued(true);
          setTimeout(() => setQueued(false), 1500);
        });
      }
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-sm-8 form-horizontal">
          <div className="form-group row">
            <label className="control-label col-sm-4">Input ISBN </label>
            <div className="col-sm-8">
              <input className="form-control" ref={inputEl} onKeyDown={keyDown} disabled={props.disable} />
            </div>
          </div>
        </div>
        <div className="col-sm-4 pull-left">
          {queuing ? <span className="label label-default">Queuing</span> : null}
          {queued ? <span className="label label-success">Book is queued</span> : null}
        </div>
      </div>
    </div>
  );
});

export default BookEntryItem;
