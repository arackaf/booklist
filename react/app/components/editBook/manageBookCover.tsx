import React, { Component, useState } from "react";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";

import UpdateBook from "graphQL/books/updateBook.graphql";
import { useMutation, buildMutation } from "micro-graphql-react";
import { getCrossOriginAttribute } from "util/corsHelpers";
import { MutationOf, Mutations } from "graphql-typings";
import FlowItems from "../layout/FlowItems";
import Stack from "../layout/Stack";

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

    fetch("https://sb1ijnzpy2.execute-api.us-east-1.amazonaws.com/dev/upload", {
      method: "POST",
      mode: "cors",
      body: request
    })
      .then(resp => resp.json())
      .then(res => {
        if (res.error) {
          setUploadState({ pendingImg: "", uploadError: res.error });
        } else {
          console.log("woo hoo", res);
          setUploadState({ pendingImg: res.url, uploadError: "" });
        }
      });
    //};

    return;
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
    <FlowItems>
      {currentUrl ? (
        <div style={{ minWidth: "110px" }}>
          <img {...getCrossOriginAttribute(currentUrl)} src={currentUrl} />
        </div>
      ) : (
        <div style={{ alignSelf: "flex-start", minWidth: "110px" }} className="alert alert-warning">
          <span style={{}}>No Cover</span>
        </div>
      )}

      {!pendingImg ? (
        <div style={{ minWidth: "100px", maxWidth: "140px" }}>
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
        <Stack>
          <img src={pendingImg} {...getCrossOriginAttribute(pendingImg)} />
          <FlowItems pushLast={true}>
            <button onClick={runSave} className="btn btn-xs btn-light btn-square-icon">
              <i className="fal fa-check" />
            </button>
            <button className="btn btn-xs btn-light btn-square-icon" onClick={() => setUploadState({ pendingImg: "", uploadError: "" })}>
              <i className="fal fa-undo" />
            </button>
          </FlowItems>
        </Stack>
      ) : null}
      <div>
        <RemoteImageUpload _id={_id} remoteSave={remoteSave} onUpdate={setCurrentUrl} />
      </div>
    </FlowItems>
  );
};

export default ManageBookCover;
