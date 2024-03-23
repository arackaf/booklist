<script lang="ts">
  export let data;

  $: ({ userUsageInfo, missingUserInfo } = data);

  Promise.resolve(missingUserInfo).then(val => {
    console.log({ val });
  });
</script>

<h1>Hello World</h1>

{#each userUsageInfo as x}
  <div>
    {x.latest}
    <br />
    {x.userId}
  </div>
{/each}
