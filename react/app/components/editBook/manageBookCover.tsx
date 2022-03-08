import React, { useState } from "react";
import Dropzone, { DropzoneState } from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";

import UpdateBook from "graphQL/books/updateBook.graphql";
import { useMutation } from "micro-graphql-react";
import { getCrossOriginAttribute } from "util/corsHelpers";
import { MutationOf, Mutations } from "graphQL/graphql-typings";
import FlowItems from "../layout/FlowItems";
import Stack from "../layout/Stack";
import { useAppState } from "app/state/appState";

const RemoteImageUpload = props => {
  const [{ userId, loginToken }] = useAppState();
  const { size, processUrlResponse, processUrlError } = props;

  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      doSave();
    }
  };

  const doSave = () => {
    setSaving(true);

    const request = { userId, loginToken, url, size };
    ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, request, processUrlResponse, processUrlError).then(() => setSaving(false));
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
  const { _id, img, size, imgKey, updateBook: updateExistingBook } = props;
  const [currentUrl, setCurrentUrl] = useState(img);
  const [uploadState, setUploadState] = useState({ pendingImg: "", uploadError: "" });

  const { runMutation: updateBook } = useMutation<MutationOf<Mutations["updateBook"]>>(UpdateBook);

  const [{ loginToken, userId }] = useAppState();

  const runSave = () => {
    let newUrl = uploadState.pendingImg;
    if (_id) {
      return updateBook({ _id, book: { [imgKey]: newUrl } }).then(() => {
        setCurrentUrl(newUrl);
        setUploadState({ pendingImg: "", uploadError: "" });
      });
    } else {
      setCurrentUrl(newUrl);
      updateExistingBook(book => ({ ...book, [imgKey]: newUrl }));
    }
  };

  const [uploading, setUploading] = useState(false);

  const processCoverResponse = res => {
    if (res.error === true) {
      res.error = "Error uploading";
    }

    if (res.error) {
      setUploadState({ pendingImg: "", uploadError: res.error });
    } else if (!res.url) {
      setUploadState({ pendingImg: "", uploadError: "Error uploading" });
    } else {
      setUploadState({ pendingImg: res.url, uploadError: "Error uploading" });
    }
    setUploading(false);
  };

  const processCoverError = res => {
    setUploadState({ pendingImg: "", uploadError: "Error uploading" });
    setUploading(false);
  };

  const onDrop = files => {
    let request = new FormData();
    request.append("fileUploaded", files[0]);
    request.append("loginToken", loginToken);
    request.append("userId", userId);
    request.append("size", size);

    setUploading(true);
    ajaxUtil.postWithFilesCors(process.env.UPLOAD_BOOK_COVER, request, processCoverResponse, processCoverError);
  };

  const { pendingImg, uploadError } = uploadState;

  const getDropzoneStyle = (state: DropzoneState) => {
    if (uploading) {
      return { border: "3px solid var(--neutral-6)", color: "var(--neutral-6)", cursor: "wait" };
    } else if (state.isDragAccept) {
      return { border: "3px solid var(--primary-8)" };
    } else if (state.isDragReject) {
      return { border: "3px solid var(--primary-9)" };
    } else if (state.isDragActive) {
      return { border: "3px solid var(--primary-9)" };
    }

    return { border: "3px solid var(--primary-9)" };
  };

  return (
    <FlowItems pushLast={true}>
      {currentUrl ? (
        <div style={{ minWidth: "110px" }}>
          <img alt="Current book cover" {...getCrossOriginAttribute(currentUrl)} src={currentUrl} />
        </div>
      ) : (
        <div style={{ alignSelf: "flex-start", minWidth: "110px" }} className="alert alert-warning">
          <span>No Cover</span>
        </div>
      )}

      {!pendingImg ? (
        <div style={{ minWidth: "100px", maxWidth: "140px", position: "relative" }}>
          <Dropzone disabled={uploading} onDrop={files => onDrop(files)} multiple={false}>
            {state => (
              <div
                {...state.getRootProps()}
                style={{ padding: "5px", fontSize: "14px", textAlign: "center", cursor: "pointer", ...getDropzoneStyle(state) }}
              >
                <input {...state.getInputProps()} />
                <div>Click or drag to upload a new cover</div>
              </div>
            )}
          </Dropzone>
          {uploadError ? (
            <div style={{ display: "inline-block", marginTop: "2px", marginBottom: "2px" }} className="label label-danger">
              {uploadError}
            </div>
          ) : null}
        </div>
      ) : null}
      {pendingImg ? (
        <Stack>
          <img alt="Pending book cover" src={pendingImg} {...getCrossOriginAttribute(pendingImg)} />
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
        <RemoteImageUpload {...{ processUrlResponse: processCoverResponse, processUrlError: processCoverError, size }} />
      </div>
    </FlowItems>
  );
};

export default ManageBookCover;
