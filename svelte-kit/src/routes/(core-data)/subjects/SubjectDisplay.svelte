<script lang="ts">
  import { onMount, untrack } from "svelte";

  import { spring } from "svelte/motion";

  import type { FullSubject, Subject } from "$data/types";

  import { syncHeight } from "$lib/util/animationHelpers.svelte";
  import SubjectLabelDisplay from "./SubjectLabelDisplay.svelte";

  import Self from "./SubjectDisplay.svelte";

  type Props = {
    editSubject: (subject: Subject) => void;
    subject: FullSubject;
  };

  let { editSubject, subject }: Props = $props();

  let contentEl: HTMLElement;
  let heightValue = $state<ReturnType<typeof syncHeight>>();

  const SPRING_CONFIG_GROWING = { stiffness: 0.1, damping: 0.4, precision: 0.01 };
  const SPRING_CONFIG_SHRINKING = { stiffness: 0.3, damping: 0.9, precision: 0.1 };
  const subjectSpring = spring({ height: -1, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);

  let expanded = $state(true);
  let animating = $state(false);

  let childSubjects = $state(subject.children);

  let height = $derived($subjectSpring.height);
  let opacity = $derived($subjectSpring.opacity);
  let x = $derived($subjectSpring.x);
  let y = $derived($subjectSpring.y);

  onMount(() => {
    heightValue = syncHeight(contentEl);
  });

  $effect(() => {
    if (heightValue?.height.value) {
      const isExpanded = untrack(() => expanded);
      setSpring(heightValue.height.value, isExpanded);
    }
  });

  $effect(() => {
    if (heightValue?.height.value === height) {
      animating = false;
    }
  });

  $effect(() => {
    animating = true;
    childSubjects = subject.children;
  });

  function setSpring(height: number, isExpanded: boolean) {
    const animate = untrack(() => animating);
    const newHeight = isExpanded ? height : 0;
    const existingHeight = untrack(() => $subjectSpring.height);

    if (existingHeight === newHeight) {
      return;
    }
    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
    subjectSpring.set({ height: newHeight, opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : 20, y: isExpanded ? 0 : -20 }, { hard: !animate });
  }

  const setExpanded = (val: boolean) => {
    expanded = val;
    animating = true;
    setSpring(expanded ? heightValue!.height.value : 0, val);
  };
</script>

<div>
  <div class="pb-5">
    <SubjectLabelDisplay {childSubjects} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} />
  </div>
  <div style="height: {animating ? height + 'px' : 'auto'}; overflow: hidden">
    <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
      {#if childSubjects.length}
        <ul class="ml-5">
          {#each childSubjects as s (s.id)}
            <li>
              <Self subject={s} {editSubject} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
