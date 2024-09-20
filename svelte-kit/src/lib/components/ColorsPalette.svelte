<script lang="ts">
  type Props = {
    currentColor: string | null;
    colors: string[];
    onColorChosen: (color: string) => void;
  };

  let { currentColor, colors, onColorChosen }: Props = $props();
</script>

<div>
  {#each colors as color}
    <button
      class="float-left border border-black h-[20px] w-[20px] m-1 cursor-pointer transition-transform"
      class:scale-125={color === currentColor}
      onclick={() => onColorChosen(color)}
      type="button"
      style="background-color: {color}"
    >
    </button>
  {/each}
</div>
