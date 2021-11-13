import React from "react";

import FlexRow from "app/components/layout/FlexRow";

import "./styles.scss";

export default props => {
  return (
    <div className="demo-root">
      <div data-reach-dialog-content className="mock-modal">
        <h4>Book Search</h4>
        <hr />
        <FlexRow>
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Title</label>
              <input placeholder="Search title" className="form-control" defaultValue={"The Slefish Gene"} />
              <div className="alert alert-warning margin-bottom">Did you spell this right?</div>
            </div>
          </div>
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Pages</label>
              <div className="form-inline">
                <div style={{ marginRight: 5, display: "inline-block" }} className="form-group">
                  <select className="form-control">
                    <option value="lt">{"<"}</option>
                    <option value="gt">{">"}</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: "inline-block" }}>
                  <input style={{ width: "100px" }} type="number" placeholder="Pages" className="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Publisher</label>
              <input placeholder="Publisher" className="form-control" defaultValue="Basic Books" />
              <div className="alert alert-success margin-bottom">Looks good to me!</div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Author</label>
              <input placeholder="Author" className="form-control" />
              <div className="alert alert-danger margin-bottom">Author is required!</div>
            </div>
          </div>
        </FlexRow>
        <hr />
        <div style={{ display: "flex" }}>
          <button className="btn btn-primary">Filter</button>
          <button className="btn" style={{ marginLeft: "auto" }}>
            Close
          </button>
        </div>
      </div>
      <div className="alert alert-info margin-top" style={{ maxWidth: "550px" }}>
        This color theme will be saved locally, and remembered the next time you browse here (on the same device)
      </div>
    </div>
  );
};
