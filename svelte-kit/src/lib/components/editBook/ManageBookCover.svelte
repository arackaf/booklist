<script lang="ts">
  //import { appState } from "app/state/appState";
  import Dropzone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  //import ajaxUtil from "util/ajaxUtil";
  import FlowItems from "../layout/FlowItems.svelte";

  export let onResults: (results: any) => void;
  export let onError: () => void;

  let uploadState = { pendingImg: "", uploadError: "" };

  let uploading = false;

  //$: ({ loginToken, userId } = $appState);
  $: ({ pendingImg, uploadError } = uploadState);

  let remoteUrl = "";
  let remoteImageSaving = false;

  const keyDown = (evt: any) => {
    if (evt.keyCode == 13) {
      doRemoteSave();
    }
  };

  const doRemoteSave = () => {
    remoteImageSaving = true;

    //const request = { userId, loginToken, url: remoteUrl };
    //ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, request, onResults, onError).then(() => (remoteImageSaving = false));
  };

  const onDrop = (evt: any) => {
    const { acceptedFiles, fileRejections } = evt.detail;
    if (!acceptedFiles.length) {
      //TODO: ??
      return;
    }
    let requestData = new FormData();
    requestData.append("fileUploaded", acceptedFiles[0]);
    //request.append("loginToken", loginToken);
    //request.append("userId", userId);

    //uploading = true;

    fetch("/api/cover-upload", { method: "POST", body: requestData });
    //ajaxUtil.postWithFilesCors(process.env.UPLOAD_BOOK_COVER, request, onResults, onError).then(() => (uploading = false));
  };

  let dragging = false;
  $: dropAddedStyles = uploading ? "border-color: var(--neutral-6); cursor: wait;" : dragging ? "border-color: var(--primary-8);" : "";
</script>

<FlowItems pushLast={true}>
  <div style="flex: 1; position: relative;">
    <Dropzone
      accept={undefined}
      disableDefaultStyles={true}
      multiple={false}
      on:drop={onDrop}
      on:dragenter={() => (dragging = true)}
      on:dragleave={() => (dragging = false)}
      containerClasses="dropzone-container"
      containerStyles={dropAddedStyles}
    >
      <div style="padding: 15px">Click or drag to upload</div>
    </Dropzone>
    {#if uploadError}
      <div style="display: inline-block; margin-top: 2px; margin-bottom: 2px" class="label label-danger">{uploadError}</div>
    {/if}
  </div>

  <div style="flex: 1">
    <div class="btn-group">
      <input bind:value={remoteUrl} on:keydown={keyDown} style="min-width: 200px" class="form-control" placeholder="New Cover URL" tabIndex={-1} />
      <button class="btn btn-default" disabled={!remoteUrl || remoteImageSaving} on:click={doRemoteSave}>
        <i class="far fa-cloud-upload-alt" />
      </button>
    </div>
  </div>
</FlowItems>

<style>
  :global(.dropzone-container) {
    border: 3px solid var(--primary-9);
    text-align: center;
    background-color: white;
    padding: 5px;
    color: var(--neutral-text);
    outline: none;
    cursor: pointer;
  }
</style>
