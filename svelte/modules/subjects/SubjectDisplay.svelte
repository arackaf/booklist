<script lang="ts">
  import { onMount } from "svelte";
  import syncHeight from "app/animationHelpers";
  import EditableExpandableLabelDisplay from "app/components/subjectsAndTags/EditableLabelDisplay.svelte";

  import SubjectList from "./SubjectList.svelte";
  import { childMapSelector } from "app/state/subjectsState";

  let contentEl;
  onMount(() => {});
  syncHeight;

  let expanded = true;
  let setExpanded = val => (expanded = val);
  export let editSubject;
  export let subject;
  const height = "auto";

  $: childSubjects = $childMapSelector[subject._id];
</script>

<style>
  .subjectRow {
    padding-left: 0;
    margin-left: 0;
  }

  .subjectRow > :global(div) {
    padding-left: 0;
  }
</style>

<li style="padding-top: 0; padding-bottom: 0">
  <div>
    <div class="padding-bottom-med subjectRow">
      <EditableExpandableLabelDisplay {childSubjects} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} />
    </div>
    <div style="height: {expanded ? 'auto' : height}">
      <div bind:this={contentEl} data-style="opacity, transform">
        <SubjectList subjects={childSubjects} {editSubject} />
      </div>
    </div>
  </div>
</li>
