<script lang="ts">
  import { CloudUploadIcon, LoaderCircle } from "lucide-svelte";
  import Dropzone from "svelte-file-dropzone";

  import { cn } from "$lib/utils";
  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  type Props = {
    onResults: (results: any) => void;
    onError: () => void;
  };

  let { onResults, onError }: Props = $props();

  let uploadState = $state({ uploadError: "" });
  let uploading = $state(false);
  let dragging = $state(false);
  let remoteUrl = $state("");
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

    dragging = false;
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
    <div class="flex-1 flex flex-col gap-1.5" style="position: relative;">
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
          containerClasses={cn("dropzone-container rounded p-1 text-center border-2", {
            "border-primary": dragging,
            "border-border": !dragging || uploading
          })}
        >
          <div class={cn("flex gap-2 items-center p-4 justify-center", { "text-muted-foreground": uploading })}>
            {#if uploading}
              <span>Uploading</span> <LoaderCircle size={20} class="animate-spin" />
            {:else}
              <span>Click or drag to upload</span>
            {/if}
          </div>
        </Dropzone>
      {/key}
      {#if uploadError}
        <Badge class="self-start" variant="destructive">{uploadError}</Badge>
      {/if}
    </div>

    <div class="flex-1">
      <div class="flex">
        <Input
          bind:value={remoteUrl}
          disabled={uploading}
          class="flex-1 rounded-tr-none rounded-br-none border-r-0 focus-visible:ring-0 focus-visible:ring-transparent"
          placeholder="New Cover URL"
        />
        <Button type="submit" variant="outline" size="icon" class="p-0 rounded-tl-none rounded-bl-none" disabled={!remoteUrl || uploading}>
          <CloudUploadIcon class="h-5! w-5!" />
        </Button>
      </div>
    </div>
  </div>
</form>
