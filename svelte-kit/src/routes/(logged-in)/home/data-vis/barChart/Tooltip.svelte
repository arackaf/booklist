<script lang="ts">
  export let name: string;
</script>

<div class="root">
  <div>{name}</div>
  <span>Hello</span>
  <span>World</span>
  <div class="arrow" />
</div>

<style>
  .root {
    --bg-color: var(--info-9);
    --arrow-size: 10px;
    --arrow-offset: calc(var(--arrow-size) / 2);
    color: var(--neutral-3);
    background-color: var(--bg-color);
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    transform: translateX(calc(100% + var(--arrow-size) / 2));
  }

  .arrow,
  .arrow::before {
    background-color: var(--bg-color);
    position: absolute;
    width: var(--arrow-size);
    height: var(--arrow-size);
    background: inherit;
  }

  .arrow {
    visibility: hidden;
    top: calc(50% - var(--arrow-offset));
    left: calc(-1 * var(--arrow-offset));
  }
  .arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }
</style>
