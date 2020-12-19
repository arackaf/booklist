<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import SubjectDisplay from "./SubjectDisplay.svelte";

  export let subjects: any[];
  export let editSubject;
  export let root = false;

  if (root) {
    setContext("subject-chain-disable-animation", writable(false));
  }
</script>

<ul>
  {#each subjects as s (s._id)}
    <SubjectDisplay subject={s} {editSubject} />
  {/each}
</ul>
