<script lang="ts">
  import Separator from "./ui/separator/separator.svelte";

  type Props = {
    caption?: string;
    smaller?: boolean;
    onHide?: () => void;
  };

  let { caption = "", smaller = false, onHide = () => {} }: Props = $props();
</script>

<div class="flex items-center">
  <h1 class:text-base={smaller} class:text-xl={!smaller} class="font-normal">{caption}</h1>

  <button style="margin-left: auto; display: flex;" class="close raw-button text-lg font-bold" onclick={onHide} aria-label="Close modal">
    <i class="far fa-times"></i>
  </button>
</div>
<Separator class="mt-2 h-[2px]" />
