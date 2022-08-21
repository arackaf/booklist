<script lang="ts">
  export let props: svelte.JSX.HTMLAttributes<HTMLButtonElement>;

  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment} {...props}>
  count is {count}
</button>
