<script lang="ts">
  import { getContext, onMount } from "svelte";

  import { spring } from "svelte/motion";
  import { scale } from "svelte/transition";
  import { quadIn } from "svelte/easing";

  import type { FullSubject, Subject } from "$data/types";

  import { syncHeight } from "$lib/util/animationHelpers.svelte";
  import SubjectLabelDisplay from "./SubjectLabelDisplay.svelte";
  import { flip } from "svelte/animate";
  import { exitStart, scaleTransitionProps } from "./animationHelpers";

  import Self from "./SubjectDisplay.svelte";

  type Props = {
    editSubject: (subject: Subject) => void;
    subject: FullSubject;
  };

  let { editSubject, subject }: Props = $props();

  const disabledAnimationInChain: any = getContext("subject-chain-disable-animation");

  let blockingUpstream: boolean;
  let contentEl: HTMLElement;
  let heightStore = $state<ReturnType<typeof syncHeight>>();

  const SPRING_CONFIG_GROWING = { stiffness: 0.1, damping: 0.4, precision: 0.01 };
  const SPRING_CONFIG_SHRINKING = { stiffness: 0.3, damping: 0.9, precision: 0.1 };
  const subjectSpring = spring({ height: -1, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);

  onMount(() => {
    heightStore = syncHeight(contentEl);
  });

  $effect(() => {
    if (heightStore) {
      setSpring(heightStore.height.value, expanded);
    }
  });

  let initialRenderComplete = $state(false);
  let hide = $state(false);
  let expanded = $state(true);

  let childSubjects = $derived(subject.children);
  let height = $derived($subjectSpring.height);
  let opacity = $derived($subjectSpring.opacity);
  let x = $derived($subjectSpring.x);
  let y = $derived($subjectSpring.y);

  function setSpring(height: number, expanded: boolean) {
    if (blockingUpstream) {
      disabledAnimationInChain.value = true;
    }

    const newHeight = expanded ? height : 0;
    const existingHeight = $subjectSpring.height;

    if ($subjectSpring.height === newHeight) {
      return;
    }
    let animation = subjectSpring
      .set(
        { height: newHeight, opacity: expanded ? 1 : 0, x: expanded ? 0 : 20, y: expanded ? 0 : -20 },
        { hard: !initialRenderComplete || (disabledAnimationInChain.value && !blockingUpstream) }
      )
      .then(() => {
        initialRenderComplete = true;
        hide = !expanded;
      });
    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
    if (blockingUpstream) {
      Promise.resolve(animation).then(() => {
        disabledAnimationInChain.value = false;
        blockingUpstream = false;
      });
    }
  }

  const setExpanded = (val: boolean) => {
    blockingUpstream = true;
    expanded = val;
  };
</script>

<div>
  <div class="pb-5">
    <SubjectLabelDisplay {childSubjects} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} />
  </div>
  <div style="height: {height < 0 ? 'auto' : height + 'px'}; overflow: hidden">
    <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
      {#if childSubjects.length}
        <ul class="ml-5" onoutrostart={exitStart} transition:scale|local={scaleTransitionProps}>
          {#each childSubjects as s (s.id)}
            <li onoutrostart={exitStart} animate:flip={{ duration: 150, easing: quadIn }} transition:scale|local={scaleTransitionProps}>
              <Self subject={s} {editSubject} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
