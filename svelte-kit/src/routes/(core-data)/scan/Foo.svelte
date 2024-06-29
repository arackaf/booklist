<script lang="ts" generics="T, U">
  type Props = {
    a: T;
    b: T;
    c: U;
  };
  let { a, b }: Props = $props();
</script>

A {a}
B {b}
