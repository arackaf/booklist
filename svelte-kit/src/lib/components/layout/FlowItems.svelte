<script>
  import cn from "classnames";

  let className = $$props["class"];
  export let style = "";
  export let containerStyle = "";
  export let xsFlowReverse = false;
  export let tighter = false;
  export let tightest = false;
  export let vCenter = false;
  export let pushLast = false;

  const cssClasses = {
    tighter,
    tightest,
    ["v-center"]: vCenter,
    ["push-last"]: pushLast,
    ["xs-pull-reverse"]: xsFlowReverse
  };
</script>

<div class={cn('flow-items', className, cssClasses)} style={style}>
  <div style={containerStyle}>
    <slot />
  </div>
</div>


