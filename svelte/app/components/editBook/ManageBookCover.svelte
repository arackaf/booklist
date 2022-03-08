<script lang="ts">
  import { appState } from "app/state/appState";
  import { MutationOf, Mutations } from "graphQL/graphql-typings";
  import Dropzone from "svelte-file-dropzone/src/components/Dropzone.svelte";

  import ajaxUtil from "util/ajaxUtil";
  import { getCrossOriginAttribute } from "util/corsHelpers";

  import UpdateBook from "graphQL/books/updateBook.graphql";
  import { mutation } from "micro-graphql-svelte";

  import FlowItems from "../layout/FlowItems.svelte";
  import Stack from "../layout/Stack.svelte";

  export let _id;
  export let img;
  export let size;
  export let imgKey;
  export let updateBookObject;

  let currentUrl = img;
  let uploadState = { pendingImg: "", uploadError: "" };

  let uploading = false;
  const { mutationState } = mutation<MutationOf<Mutations["updateBook"]>>(UpdateBook);
  let { runMutation: updateBook } = $mutationState;

  $: ({ loginToken, userId } = $appState);
  $: ({ pendingImg, uploadError } = uploadState);

  let remoteUrl = "";
  let remoteImageSaving = false;

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      doRemoteSave();
    }
  };

  const doRemoteSave = () => {
    remoteImageSaving = true;

    const request = { userId, loginToken, url: remoteUrl, size };
    ajaxUtil
      .postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, request, processUrlResponse, processUrlError)
      .then(() => (remoteImageSaving = false));
  };

  const runSave = () => {
    let newUrl = uploadState.pendingImg;
    if (_id) {
      return updateBook({ _id, book: { [imgKey]: newUrl } }).then(() => {
        currentUrl = newUrl;
        uploadState = { pendingImg: "", uploadError: "" };
      });
    } else {
      currentUrl = newUrl;
      updateBookObject(book => ({ ...book, [imgKey]: newUrl }));
    }
  };

  const processUrlResponse = res => {
    if (res.error) {
      uploadState = { pendingImg: "", uploadError: res.error };
    } else if (!res.url) {
      uploadState = { pendingImg: "", uploadError: "Error uploading" };
    } else {
      uploadState = { pendingImg: res.url, uploadError: "" };
    }
    uploading = false;
  };

  const processUrlError = res => {
    uploadState = { pendingImg: "", uploadError: "Error uploading" };
    uploading = false;
  };

  const onDrop = evt => {
    const { acceptedFiles, fileRejections } = evt.detail;
    if (!acceptedFiles.length) {
      //TODO: ??
      return;
    }
    let request = new FormData();
    request.append("fileUploaded", acceptedFiles[0]);
    request.append("loginToken", loginToken);
    request.append("userId", userId);
    request.append("size", size);

    uploading = true;
    ajaxUtil.postWithFilesCors(process.env.UPLOAD_BOOK_COVER, request, processUrlResponse, processUrlError);
  };

  let dragging = false;
  $: dropAddedStyles = uploading ? "border-color: var(--neutral-6); cursor: wait;" : dragging ? "border-color: var(--primary-8);" : "";
</script>

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

<FlowItems pushLast={true}>
  {#if currentUrl}
    <div style="min-width: 110px"><img alt="Current book cover" {...getCrossOriginAttribute(currentUrl)} src={currentUrl} /></div>
  {:else}
    <div style="align-self: flex-start; min-width: 110px;" class="alert alert-warning"><span>No Cover</span></div>
  {/if}

  {#if !pendingImg}
    <div style="min-width: 100px; max-width: 140px; position: relative;">
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
        <div>Click or drag to upload a new cover</div>
      </Dropzone>
      {#if uploadError}
        <div style="display: inline-block; margin-top: 2px; margin-bottom: 2px" class="label label-danger">{uploadError}</div>
      {/if}
    </div>
  {/if}
  {#if pendingImg}
    <Stack>
      <img alt="Pending book cover" src={pendingImg} {...getCrossOriginAttribute(pendingImg)} />
      <FlowItems pushLast={true}>
        <button on:click={runSave} class="btn btn-xs btn-light btn-square-icon"> <i class="fal fa-check" /> </button>
        <button on:click={() => (uploadState = { pendingImg: "", uploadError: "" })} class="btn btn-xs btn-light btn-square-icon">
          <i class="fal fa-undo" />
        </button>
      </FlowItems>
    </Stack>
  {/if}
  <div>
    <div class="btn-group">
      <input bind:value={remoteUrl} on:keydown={keyDown} style="min-width: 200px" class="form-control" placeholder="New Cover URL" tabIndex={-1} />
      <button class="btn btn-default" disabled={!remoteUrl || remoteImageSaving} on:click={doRemoteSave}>
        <i class="far fa-cloud-upload-alt" />
      </button>
    </div>
  </div>
</FlowItems>
