<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { spring } from "svelte/motion";
  import syncHeight from "app/animationHelpers";
  import EditableExpandableLabelDisplay from "app/components/subjectsAndTags/EditableLabelDisplay.svelte";

  import SubjectList from "./SubjectList.svelte";
  import { childMapSelector } from "app/state/subjectsState";

  const subjectsSettings: any = getContext("subjects-module");
  const disabledAnimationInChain: any = getContext("subject-chain-disable-animation");

  let contentEl;
  let heightStore;
  //const SPRING_CONFIG = { stiffness: 0.2, damping: 0.6, precision: 0.01 };
  // const SPRING_CONFIG = { stiffness: 0.1, damping: 0.1, precision: 0.01 };
  const SPRING_CONFIG = { stiffness: 0.1, damping: 0.3, precision: 0.01 };
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
      heightChanged($heightStore);
    }
  }

  $: expandedChanged(expanded);

  function heightChanged(height) {
    setSpring(height, expanded);
  }

  function expandedChanged(expanded) {
    $disabledAnimationInChain = true;
    Promise.resolve(setSpring($heightStore, expanded, true)).then(() => {
      console.log("DONE");
    });
  }

  function setSpring(height, expanded, active = false) {
    return subjectSpring.set(
      { height: expanded ? height : 0, opacity: expanded ? 1 : 0, x: expanded ? 0 : 20, y: expanded ? 0 : -20 },
      { hard: !$subjectsSettings.initialized || ($disabledAnimationInChain && !active) }
    );
  }

  let expanded = true;
  let setExpanded = val => (expanded = val);
  export let editSubject;
  export let subject;

  $: childSubjects = $childMapSelector[subject._id];
  $: ({ height, opacity, x, y } = $subjectSpring);
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
    <div style="height: {height}px; overflow: hidden">
      <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
        <SubjectList subjects={childSubjects} {editSubject} />
      </div>
    </div>
  </div>
</li>
