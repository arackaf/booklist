<script lang="ts" generics="T extends {id: number }">
  type Props = {
    data: T[];
    addItems: (item: T) => void;
  };

  let { data, addItems }: Props = $props();
</script>

<span>{data.length}</span>
