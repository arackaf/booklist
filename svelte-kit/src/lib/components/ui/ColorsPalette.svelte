<script lang="ts">
  export let currentColor: string;
  export let colors: string[];
  export let onColorChosen: (color: string) => {};
</script>

<div>
  {#each colors as color}
    <div
      class="colorChoice"
      class:colorChoiceCurrent={color == currentColor}
      on:click={() => onColorChosen(color)}
      on:keydown={() => {}}
      style="background-color: {color}"
    />
  {/each}
</div>

<style>
  .colorChoice {
    float: left;
    border: var(--default-border-width) solid black;
    height: 20px;
    width: 20px;
    margin: 3px;
    cursor: pointer;
  }
  .colorChoice.colorChoiceCurrent {
    border: 3px solid white;
  }
</style>
