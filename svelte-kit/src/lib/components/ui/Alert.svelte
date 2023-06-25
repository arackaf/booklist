<script lang="ts">
  export let display = "flex";

  export let type: "warning" | "info" | "success" | "error" = "info";
  export let layout: "normal" | "slim" | "slimmer" = "normal";

  let className = "";
  export { className as class };

  let colors = "";

  let padding = layout === "normal" ? "p-3" : layout === "slim" ? "p-2" : "p-1";

  $: {
    if (type === "info") {
      colors = "bg-info-9 border border-info-8 text-info-1";
    } else if (type === "success") {
      colors = "bg-success-9 border border-success-8 text-success-1";
    } else if (type === "warning") {
      colors = "bg-warning-9 border border-warning-8 text-warning-1";
    } else if (type === "error") {
      colors = "bg-danger-9 border border-danger-8 text-danger-1";
    }
  }
</script>

<div class="{display} {colors} items-center {padding} rounded {className}">
  <slot />
</div>
