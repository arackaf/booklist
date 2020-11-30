<script>
  import { getContext } from "svelte";
  export let href;

  const history = getContext("booklist-history");

  function onClick(evt) {
    evt.preventDefault();

    history.push(`/${href}`);
  }
</script>

<a {href} on:click={onClick}>
  <slot />
</a>
