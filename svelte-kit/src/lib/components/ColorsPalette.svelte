<script lang="ts">
  export let currentColor: string | null;
  export let colors: string[];
  export let onColorChosen: (color: string) => {};
</script>

<div>
  {#each colors as color}
    <button
      class="float-left border border-black h-[20px] w-[20px] m-1 cursor-pointer transition-transform"
      class:scale-125={color == currentColor}
      on:click={() => onColorChosen(color)}
      type="button"
      style="background-color: {color}"
    />
  {/each}
</div>
