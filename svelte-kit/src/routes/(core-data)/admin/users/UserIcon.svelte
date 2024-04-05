<script lang="ts">
  export let provider: string;
</script>

<span class="text-4xl">
  {#if provider == "google" || provider == "github"}
    <i class="fab {provider === 'google' ? 'fa-google' : 'fa-github'}" />
  {:else}
    <i class="fad fa-user" />
  {/if}
</span>
