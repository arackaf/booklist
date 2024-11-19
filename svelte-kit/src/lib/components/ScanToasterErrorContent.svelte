<script lang="ts">
  type Props = {
    packet: { title: string };
  };

  let { packet }: Props = $props();
</script>

<section class="flex w-[300px] gap-1">
  <div class="text-white">{packet.title}</div>
</section>
