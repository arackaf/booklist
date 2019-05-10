<script>
  export let data;
</script>

{#each data.anonymousLinks as link}
  {#if link.action}
    <a
      href="x"
      data-riotbar-link-id={link.id}
      class="riotbar-anonymous-link riotbar-account-action"
      data-riotbar-account-action={link.action}>
      {link.text}
    </a>
  {:else}
    <a
      data-riotbar-link-id={link.id}
      class="riotbar-anonymous-link"
      href={link.url || 'javascript:void(0)'}>
      {link.text}
    </a>
  {/if}
{/each}
