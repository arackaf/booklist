import React from "react";

import styles from "./styles.module.css";
const { mockModal } = styles;

export default props => {
  return (
    <div style={{ padding: "20px" }}>
      <div className={mockModal}>
        <h4>Book Search</h4>
        <hr />
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Title</label>
              <input placeholder="Search title" className="form-control" value={"The Slefish Gene"} />
            </div>
            <div className="alert alert-warning margin-bottom">Did you spell this right?</div>
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
              <input placeholder="Publisher" className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Author</label>
              <input placeholder="Author" className="form-control" />
            </div>
            <div className="alert alert-danger margin-bottom">Author is required! (but only for this style demo)</div>
          </div>
        </div>
        <hr />
        <div style={{ display: "flex" }}>
          <button className="btn btn-primary pull-left">Filter</button>
          <button className="btn" style={{ marginLeft: "auto" }}>
            Close
          </button>
        </div>
      </div>
      <div className="alert alert-info margin-bottom margin-top" style={{ maxWidth: "550px" }}>
        Just FYI, but this color theme will be saved locally, and remembered the next time you browse here! (on the same device)
      </div>
    </div>
  );
};
