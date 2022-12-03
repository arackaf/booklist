<script>
  import cn from "classnames";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let className = "";
  export { className as class };
  export let style = "";
  export let inline = false;
  export let tighter = false;
  export let tightest = false;
  export let looser = false;
  export let loosest = false;
</script>

<div on:click={evt => dispatch("click", evt)} {style} class={cn("stack", className, { inline, tighter, tightest, looser, loosest })} {...$$restProps}>
  <slot />
</div>
