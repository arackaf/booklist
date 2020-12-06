<script>
  import cn from "classnames";

  let className;
  export { className as class };

  export let style = "";
  export let tighter = false;
  export let tightest = false;
  export let xsFlowReverse = false;
</script>

<div {style} className={cn('flex-row', className || "", { tighter, tightest, ['xs-pull-reverse']: xsFlowReverse })}>
  <div>
    <slot />
  </div>
</div>
