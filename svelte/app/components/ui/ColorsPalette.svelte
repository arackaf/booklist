<script lang="ts">
  export let currentColor;
  export let colors;
  export let onColorChosen;
</script>

<style>
  .colorChoice {
    float: left;
    border: 1px solid black;
    height: 20px;
    width: 20px;
    margin: 3px;
    cursor: pointer;
  }
  .colorChoice.colorChoiceCurrent {
    border: 3px solid white;
  }
</style>

<div>
  {#each colors as color}
    <div
      class="colorChoice"
      class:colorChoiceCurrent={color == currentColor}
      on:click={() => onColorChosen(color)}
      style="background-color: {color}"
    />
  {/each}
</div>
