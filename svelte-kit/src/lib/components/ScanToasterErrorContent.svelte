<script lang="ts">
  export let packet: { title: string };
</script>

<section class="flex w-[300px] gap-1">
  <div class="text-white">{packet.title}</div>
</section>
