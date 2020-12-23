<script>
  import cn from "classnames";

  let className = "";
  export { className as class };

  export let style = "";
  export let containerStyle = "";
  export let tighter = false;
  export let tightest = false;
  export let xsFlowReverse = false;
</script>

<div {style} class={cn('flex-row', className || "", { tighter, tightest, ['xs-pull-reverse']: xsFlowReverse })}>
  <div style={containerStyle}>
    <slot />
  </div>
</div>
