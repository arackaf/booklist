<script lang="ts">
  import SubjectDisplay from "./SubjectDisplay.svelte";

  export let subjects: any[];
  export let editSubject;
</script>

<ul>
  {#each subjects as s (s._id)}
    <SubjectDisplay subject={s} {editSubject} />
  {/each}
</ul>
