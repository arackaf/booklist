<script lang="ts">
  import { page } from "$app/stores";

  export let data;

  $: ({ userUsageInfo } = data);
</script>

<h1>Hello World</h1>

{#each userUsageInfo as x}
  <div>
    {x.latest}
    <br />
    {x.userId}
  </div>
{/each}
