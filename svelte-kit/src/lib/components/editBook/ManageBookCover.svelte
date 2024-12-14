<script lang="ts">
  import Dropzone from "svelte-file-dropzone";

  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import Button from "$lib/components/Button/Button.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";

  type Props = {
    onResults: (results: any) => void;
    onError: () => void;
  };

  let { onResults, onError }: Props = $props();

  let uploadState = $state({ uploadError: "" });
  let uploading = $state(false);
  let dragging = $state(false);
  let remoteUrl = $state("");

  let dropAddedStyles = $derived(uploading ? "border-color: var(--neutral-6); cursor: wait;" : dragging ? "border-color: var(--primary-8);" : "");
  let uploadError = $derived(uploadState.uploadError);

  const doRemoteSave = (evt: Event) => {
    evt.preventDefault();

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
    const { acceptedFiles } = evt.detail;
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
        if (resp == null || !resp.error) {
          onResults(resp);
        } else {
          onError();
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

<form onsubmit={doRemoteSave}>
  <div class="flex flex-row gap-4">
    <div class="flex-1" style="position: relative;">
      {#key uploading ? 1 : 0}
        <Dropzone
          inputElement={null}
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
        <Label theme="error">{uploadError}</Label>
      {/if}
    </div>

    <div class="flex-1">
      <div class="flex">
        <Input
          bind:value={remoteUrl}
          disabled={uploading}
          class="flex-1 rounded-tr-none rounded-br-none border-r-0"
          placeholder="New Cover URL"
          size="sm"
        />
        <Button class="h-8 p-0 rounded-tl-none rounded-bl-none" disabled={!remoteUrl || uploading}>
          <i class="far fa-cloud-upload-alt"></i>
        </Button>
      </div>
    </div>
  </div>
</form>
