<script lang="ts">
  import type { Data, Position } from "./tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;

  $: console.log({ data });
</script>

<div class={"root " + position}>
  <div class="content">
    <span class="name">{data.display}: {data.count}</span>
    <button class="raw-button"><i class="fal fa-times" /></button>
  </div>
  <br />
  <br />
  <button class="raw-button">Drill</button>
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
  .root.right {
    margin-top: 10px;
    transform: translateX(calc(-1 * (100% + var(--arrow-diagonal))));
  }
  .root.top {
    transform: translateY(calc(-1 * var(--arrow-diagonal)));
  }

  .content {
    display: flex;
    align-items: baseline;
  }

  .name {
    font-size: 22px;
    margin-right: 12px;
  }

  button {
    cursor: pointer;
    font-size: 18px;
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
  .arrow.right {
    top: calc(50% - var(--arrow-offset));
    right: calc(-1 * var(--arrow-offset));
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
