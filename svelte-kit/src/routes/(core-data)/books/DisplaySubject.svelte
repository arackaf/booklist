<script lang="ts">
  import Self from "./DisplaySubject.svelte";
  type Props = {
    subject: any;
  };

  let { subject }: Props = $props();
</script>

{subject.name}
{#if subject.children.length}
  <ul>
    {#each subject.children as child}
      <li>
        <Self subject={child} />
      </li>
    {/each}
  </ul>
{/if}
