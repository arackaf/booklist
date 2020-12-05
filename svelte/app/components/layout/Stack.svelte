<script>
  import cn from "classnames";

  let className = "";
  export { className as class };
  export let style = "";
  export let tighter = false;
  export let tightest = false;
  export let looser = false;
  export let loosest = false;
</script>

<div {style} class={cn('stack', className, { tighter, tightest, looser, loosest })} {...$$restProps}>
  <slot />
</div>
