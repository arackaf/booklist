<script>
  import "uikit/book-cover";
  import "uikit/no-book-cover";

  export let url = "";
  export let noCoverElementName = "";
  export let preview = "";
</script>

<uikit-cover {url} {preview} nocover={noCoverElementName} />
