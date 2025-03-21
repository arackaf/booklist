<script lang="ts">
  import { CircleUserRoundIcon } from "lucide-svelte";

  type Props = {
    provider: string;
    avatar: string | null;
  };

  let { provider, avatar }: Props = $props();
</script>

<span class="text-4xl leading-none">
  {#if provider !== "Legacy" && avatar}
    <img alt="User profile" src={avatar} class="w-11 h-11 rounded-full" />
  {:else}
    <CircleUserRoundIcon size={44} />
  {/if}
</span>
