<script lang="ts">
  import { getContext, onMount } from "svelte";

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

  onMount(() => {
    heightValue = syncHeight(contentEl);
  });

  $effect(() => {
    if (heightValue) {
      setSpring(heightValue.height.value, expanded);
    }
  });

  let initialRenderComplete = $state(false);
  let hide = $state(false);
  let expanded = $state(true);
  let userClick = $state(false);

  let childSubjects = $derived(subject.children);
  let height = $derived($subjectSpring.height);
  let opacity = $derived($subjectSpring.opacity);
  let x = $derived($subjectSpring.x);
  let y = $derived($subjectSpring.y);

  function setSpring(height: number, expanded: boolean) {
    const newHeight = expanded ? height : 0;
    const existingHeight = $subjectSpring.height;

    if ($subjectSpring.height === newHeight) {
      return;
    }
    subjectSpring
      .set(
        { height: newHeight, opacity: expanded ? 1 : 0, x: expanded ? 0 : 20, y: expanded ? 0 : -20 },
        { hard: !initialRenderComplete || !userClick }
      )
      .then(() => {
        initialRenderComplete = true;
        hide = !expanded;
        userClick = false;
      });
    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
  }

  const setExpanded = (val: boolean) => {
    userClick = true;
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
