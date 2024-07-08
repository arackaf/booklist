<script lang="ts">
  import { getContext, onMount } from "svelte";

  import { spring } from "svelte/motion";
  import { scale } from "svelte/transition";
  import { quadIn } from "svelte/easing";

  import type { FullSubject, Subject } from "$data/types";

  import { syncHeight } from "$lib/util/animationHelpers";
  import SubjectLabelDisplay from "./SubjectLabelDisplay.svelte";
  import { flip } from "svelte/animate";
  import { exitStart, scaleTransitionProps } from "./animationHelpers";

  export let editSubject: (subject: Subject) => void;
  export let subject: FullSubject;

  const disabledAnimationInChain: any = getContext("subject-chain-disable-animation");

  let blockingUpstream: boolean;
  let contentEl: HTMLElement;
  let heightStore: any;

  const SPRING_CONFIG_GROWING = { stiffness: 0.1, damping: 0.4, precision: 0.01 };
  const SPRING_CONFIG_SHRINKING = { stiffness: 0.3, damping: 0.9, precision: 0.1 };
  const subjectSpring = spring({ height: 0, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);

  onMount(() => {
    heightStore = syncHeight(contentEl);
  });

  $: setSpring($heightStore, expanded);

  let initialRender = false;
  let hide = false;
  function setSpring(height: number, expanded: boolean) {
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
      .then(() => {
        initialRender = true;
        hide = !expanded;
      });
    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
    if (blockingUpstream) {
      Promise.resolve(animation).then(() => {
        $disabledAnimationInChain = false;
        blockingUpstream = false;
      });
    }
  }

  let expanded = true;
  let setExpanded = (val: boolean) => {
    blockingUpstream = true;
    expanded = val;
  };

  $: childSubjects = subject.children;
  $: ({ height, opacity, x, y } = $subjectSpring);
</script>

<div>
  <div class="pb-5">
    <SubjectLabelDisplay {childSubjects} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} />
  </div>
  <div style="height: {height}px; overflow: {hide && !expanded ? 'hidden' : 'unset'};">
    <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
      {#if childSubjects.length}
        <ul class="ml-5" on:outrostart={exitStart} transition:scale|local={scaleTransitionProps}>
          {#each childSubjects as s (s.id)}
            <li on:outrostart={exitStart} animate:flip={{ duration: 150, easing: quadIn }} transition:scale|local={scaleTransitionProps}>
              <svelte:self subject={s} {editSubject} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
