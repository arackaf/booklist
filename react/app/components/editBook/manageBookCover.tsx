import React, { Component, useState } from "react";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";

import UpdateBook from "graphQL/books/updateBook.graphql";
import { useMutation, buildMutation } from "micro-graphql-react";
import { getCrossOriginAttribute } from "util/corsHelpers";
import { MutationOf, Mutations } from "graphql-typings";

const RemoteImageUpload = props => {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      doSave();
    }
  };

  const doSave = () => {
    setSaving(true);
    Promise.resolve(props.remoteSave({ _id: props._id, url })).then(({ url, failure }) => {
      setSaving(false);
      if (!failure) {
        props.onUpdate(url);
      }
      setUrl("");
    });
  };

  return (
    <div className="btn-group">
      <input
        onKeyDown={keyDown}
        value={url}
        style={{ minWidth: "200px" }}
        onChange={e => setUrl(e.target.value)}
        className="form-control"
        placeholder="New Cover URL"
        tabIndex={-1}
      />
      <button className="btn btn-default" disabled={!url || saving} onClick={doSave}>
        <i className="far fa-cloud-upload-alt" />
      </button>
    </div>
  );
};

const ManageBookCover = props => {
  const { _id, img, endpoint, imgKey, remoteSave } = props;
  const [currentUrl, setCurrentUrl] = useState(img);
  const [uploadState, setUploadState] = useState({ pendingImg: "", uploadError: "" });

  const { runMutation: updateBook } = useMutation<MutationOf<Mutations["updateBook"]>>(buildMutation(UpdateBook));

  const runSave = () => {
    if (!uploadState.pendingImg) {
      return;
    }
    let newUrl = uploadState.pendingImg;
    return updateBook({ _id, book: { [imgKey]: uploadState.pendingImg } }).then(() => {
      setCurrentUrl(newUrl);
      setUploadState({ pendingImg: "", uploadError: "" });
    });
  };

  const onDrop = files => {
    let request = new FormData();
    request.append("fileUploaded", files[0]);

    ajaxUtil.postWithFiles(`/react/${endpoint}`, request, res => {
      if (res.error) {
        setUploadState({ pendingImg: "", uploadError: res.error });
      } else {
        setUploadState({ pendingImg: res.url, uploadError: "" });
      }
    });
  };

  const { pendingImg, uploadError } = uploadState;
  return (
    <div style={{ display: "flex", flexFlow: "row wrap" }}>
      <div className="margin-right">
        {currentUrl ? <img {...getCrossOriginAttribute(currentUrl)} src={currentUrl} /> : <span className="alert alert-warning">No Cover</span>}
      </div>
      {!pendingImg ? (
        <div className="margin-right" style={{ minWidth: "100px", maxWidth: "140px" }}>
          <Dropzone
            acceptStyle={{ border: "3px solid var(--primary-8)" }}
            rejectStyle={{ border: "3px solid var(--primary-9)" }}
            activeStyle={{ border: "3px solid var(--primary-9)" }}
            disabledStyle={{ border: "3px solid var(--primary-9)" }}
            style={{ border: "3px solid var(--primary-9)", padding: "5px", fontSize: "14px", textAlign: "center", cursor: "pointer" }}
            onDrop={files => onDrop(files)}
            multiple={false}
          >
            <div>Click or drag to upload a new cover</div>
          </Dropzone>
          {uploadError ? (
            <div style={{ display: "inline-block", marginBottom: "2px" }} className="label label-danger">
              {uploadError}
            </div>
          ) : null}
        </div>
      ) : null}
      {pendingImg ? (
        <div className="margin-right">
          <img src={pendingImg} {...getCrossOriginAttribute(pendingImg)} />
          <br />
          <div style={{ display: "flex" }}>
            <button onClick={runSave} className="btn btn-xs btn-light btn-square-icon">
              <i className="fal fa-check" />
            </button>
            <button
              className="btn btn-xs btn-light btn-square-icon"
              style={{ marginLeft: "auto" }}
              onClick={() => setUploadState({ pendingImg: "", uploadError: "" })}
            >
              <i className="fal fa-undo" />
            </button>
          </div>
        </div>
      ) : null}
      <div>
        <RemoteImageUpload _id={_id} remoteSave={remoteSave} onUpdate={setCurrentUrl} />
      </div>
    </div>
  );
};

export default ManageBookCover;
