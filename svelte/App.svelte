<script>
  let value = 0;
</script>

<button on:click={() => value++}>Inc</button>
Current Val: {value}
<button on:click={() => value--}>Dec</button>
