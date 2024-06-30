<script lang="ts">
  export let provider: string;
  export let avatar: string | null;
</script>

<span class="text-4xl leading-none">
  {#if provider !== "Legacy" && avatar}
    <img alt="User profile" src={avatar} class="w-11 h-11 rounded-full" />
  {:else if provider == "google" || provider == "github"}
    <i class="fab {provider === 'google' ? 'fa-google' : 'fa-github'}"></i>
  {:else}
    <i class="fad fa-user"></i>
  {/if}
</span>
