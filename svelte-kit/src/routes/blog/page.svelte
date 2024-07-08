<script lang="ts">
  import Foo from "./Foo.svelte";

  type X = {
    //id: number;
    name: string;
  };

  function add(item: X) {}

  let data: X[] = [];
</script>

<Foo {data} addItems={add}></Foo>
