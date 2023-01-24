<script lang="ts">
  import { ajaxUtil } from "$lib/util/ajaxUtil";

  //import { appState } from "app/state/appState";
  import Dropzone from "svelte-file-dropzone/src/components/Dropzone.svelte";
  //import ajaxUtil from "util/ajaxUtil";
  import FlowItems from "../layout/FlowItems.svelte";

  export let onResults: (results: any) => void;
  export let onError: () => void;

  let uploadState = { uploadError: "" };

  let uploading = false;

  let dragging = false;
  $: dropAddedStyles = uploading ? "border-color: var(--neutral-6); cursor: wait;" : dragging ? "border-color: var(--primary-8);" : "";

  $: ({ uploadError } = uploadState);

  let remoteUrl = "";

  const doRemoteSave = () => {
    uploading = true;

    ajaxUtil.post(
      "/api/cover-set-url",
      { url: remoteUrl },
      resp => {
        if (!resp.error) {
          onResults(resp);
        }
        uploading = false;
      },
      () => {
        onError();
        uploading = false;
      }
    );
  };

  const onDrop = (evt: any) => {
    const { acceptedFiles, fileRejections } = evt.detail;
    if (!acceptedFiles.length) {
      //TODO: ??
      return;
    }
    let requestData = new FormData();
    const file = acceptedFiles[0];
    requestData.append("fileUploaded", file);
    requestData.append("filename", file.path);

    uploading = true;

    ajaxUtil.post(
      "/api/cover-upload",
      requestData,
      resp => {
        if (!resp.error) {
          onResults(resp);
        }
        uploading = false;
      },
      () => {
        onError();
        uploading = false;
      }
    );
  };
</script>

<FlowItems pushLast={true}>
  <div style="flex: 1; position: relative;">
    {#key uploading ? 1 : 0}
      <Dropzone
        accept={undefined}
        disabled={uploading}
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
    {/key}
    {#if uploadError}
      <div style="display: inline-block; margin-top: 2px; margin-bottom: 2px" class="label label-danger">{uploadError}</div>
    {/if}
  </div>

  <form on:submit|preventDefault={doRemoteSave}>
    <div style="flex: 1">
      <div class="btn-group">
        <input bind:value={remoteUrl} disabled={uploading} style="min-width: 200px" class="form-control" placeholder="New Cover URL" tabIndex={-1} />
        <button class="btn btn-default" disabled={!remoteUrl || uploading}>
          <i class="far fa-cloud-upload-alt" />
        </button>
      </div>
    </div>
  </form>
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
