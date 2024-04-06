<script lang="ts">
  export let provider: string;
  export let avatar: string;
</script>

<span class="text-4xl leading-none">
  {#if provider !== "Legacy" && avatar}
    <img alt="User profile" src={avatar} class="w-9 h-9 rounded-full" />
  {:else if provider == "google" || provider == "github"}
    <i class="fab {provider === 'google' ? 'fa-google' : 'fa-github'}" />
  {:else}
    <i class="fad fa-user" />
  {/if}
</span>
