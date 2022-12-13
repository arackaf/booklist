<script lang="ts">
  import type { Position } from "./tooltip";

  export let name: string;
  export let position: Position;
</script>

<div class={"root " + position}>
  <div>{name} blah blah blah blah</div>
  <span>Hello</span>
  <span>World</span>
  <div class={"arrow " + position} />
</div>

<style>
  .root {
    --bg-color: var(--info-9);
    --arrow-size: 10px;
    --arrow-diagonal: 7px; /* half of sqrt(10^2 + 10^2)  */
    --arrow-offset: 5px; /* half of sqrt(10^2 + 10^2)  */
    color: var(--neutral-3);
    background-color: var(--bg-color);
    padding: 10px;
    border-radius: 5px;
  }

  .root.left {
    margin-top: 10px;
    transform: translateX(calc(100% + var(--arrow-diagonal)));
  }
  .root.top {
    transform: translateY(calc(-1 * var(--arrow-diagonal)));
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
  }
  .arrow.left {
    top: calc(50% - var(--arrow-offset));
    left: calc(-1 * var(--arrow-offset));
  }
  .arrow.top {
    left: calc(50% - var(--arrow-offset));
    bottom: calc(-1 * var(--arrow-offset));
  }
  .arrow::before {
    visibility: visible;
    content: "";
    transform: rotate(45deg);
  }
</style>
