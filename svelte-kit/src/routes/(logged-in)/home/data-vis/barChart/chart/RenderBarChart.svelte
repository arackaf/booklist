<script lang="ts">
  import Bar from "../bars/Bar.svelte";

  export let showingData: any[];
  export let excluding: any;
  export let scaleX: any;
  export let dataScale: any;
  export let totalSvgWidth: any;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let transform: any;
  export let drilldown: any;

  $: nonExcludedGroups = showingData.filter(d => !excluding[d.groupId]);
</script>
