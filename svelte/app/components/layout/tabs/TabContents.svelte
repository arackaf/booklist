<script>
  import cn from "classnames";

  let className = "";
  export { className as class };
</script>

<div class={cn('tab-content', className)} {...$$restProps}>
  <slot />
</div>
