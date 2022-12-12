<script lang="ts">
  export let name: string;
</script>

<div class="root">
  <div>{name}</div>
  <span>Hello</span>
  <span>World</span>
</div>

<style>
  .root {
    background-color: pink;
    transform: translateX(100%);
  }
</style>
