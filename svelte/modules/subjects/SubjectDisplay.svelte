<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";

  import { syncHeight } from "app/animationHelpers";
  import EditableExpandableLabelDisplay from "app/components/subjectsAndTags/EditableLabelDisplay.svelte";

  import { childMapSelector } from "app/state/subjectsState";

  const disabledAnimationInChain: any = getContext("subject-chain-disable-animation");

  let blockingUpstream;
  let contentEl;
  let heightStore;

  const SPRING_CONFIG_GROWING = { stiffness: 0.1, damping: 0.4, precision: 0.01 };
  const SPRING_CONFIG_SHRINKING = { stiffness: 0.3, damping: 0.9, precision: 0.1 };
  const subjectSpring = spring({ height: 0, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);

  onMount(() => {
    heightStore = syncHeight(contentEl);
  });

  $: setSpring($heightStore, expanded);

  let initialRender = false;
  function setSpring(height, expanded) {
    if (blockingUpstream) {
      $disabledAnimationInChain = true;
    }

    const newHeight = expanded ? height : 0;
    const existingHeight = $subjectSpring.height;
    let animation = subjectSpring
      .set(
        { height: newHeight, opacity: expanded ? 1 : 0, x: expanded ? 0 : 20, y: expanded ? 0 : -20 },
        { hard: !initialRender || ($disabledAnimationInChain && !blockingUpstream) }
      )
      .then(() => (initialRender = true));
    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
    if (blockingUpstream) {
      Promise.resolve(animation).then(() => {
        $disabledAnimationInChain = false;
        blockingUpstream = false;
      });
    }
  }

  let expanded = true;
  let setExpanded = val => {
    blockingUpstream = true;
    expanded = val;
  };
  export let editSubject;
  export let subject;

  $: childSubjects = $childMapSelector[subject._id] as any[];
  $: ({ height, opacity, x, y } = $subjectSpring);

  //
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
    <div out:fade|local={{ duration: 300 }} class="padding-bottom-med subjectRow">
      <EditableExpandableLabelDisplay {childSubjects} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} />
    </div>
    <div style="height: {height}px;">
      <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
        {#if childSubjects.length}
          <ul>
            {#each childSubjects as s (s._id)}
              <svelte:self subject={s} {editSubject} />
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</li>
