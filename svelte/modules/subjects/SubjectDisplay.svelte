<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { spring } from "svelte/motion";
  import syncHeight from "app/animationHelpers";
  import EditableExpandableLabelDisplay from "app/components/subjectsAndTags/EditableLabelDisplay.svelte";

  import SubjectList from "./SubjectList.svelte";
  import { childMapSelector } from "app/state/subjectsState";

  const subjectsSettings: any = getContext("subjects-module");

  let contentEl;
  let initialized = false;
  let heightStore;
  const SPRING_CONFIG = { stiffness: 0.2, damping: 0.6, precision: 0.01 };
  //const SPRING_CONFIG = { stiffness: 0.1, damping: 0.1, precision: 0.01 };
  const subjectSpring = spring({ height: 0, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG);

  onMount(() => {
    heightStore = syncHeight(contentEl);
    //updateAnimation(expanded, $heightStore, false);
    // heightStore.subscribe(height => {
    //   updateAnimation(expanded, height, false);
    // });
  });

  $: {
    if (heightStore) {
      let height = $heightStore;
      debugger;
      subjectSpring.set({ height: expanded ? height : 0, opacity: 1, x: 0, y: 0 }, { hard: !$subjectsSettings.initialized });
      initialized = true;
    }
  }

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
    <div style="height: {$subjectSpring.height}px">
      <div bind:this={contentEl} data-style="opacity, transform">
        <SubjectList subjects={childSubjects} {editSubject} />
      </div>
    </div>
  </div>
</li>
