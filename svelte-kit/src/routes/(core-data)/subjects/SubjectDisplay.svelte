<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { spring, Spring } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import type { FullSubject, Subject } from "$data/types";

  import { syncHeight } from "$lib/util/animationHelpers.svelte";
  import SubjectLabelDisplay from "./SubjectLabelDisplay.svelte";

  import Self from "./SubjectDisplay.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ChevronRightIcon, PencilIcon } from "lucide-svelte";

  type Props = {
    editSubject: (subject: Subject) => void;
    subject: FullSubject;
  };

  let { editSubject, subject }: Props = $props();

  let contentEl: HTMLElement;
  let heightValue = $state<ReturnType<typeof syncHeight>>();

  const SPRING_CONFIG_GROWING = { stiffness: 0.1, damping: 0.4, precision: 0.01 };
  const SPRING_CONFIG_SHRINKING = { stiffness: 0.3, damping: 0.9, precision: 0.1 };
  const subjectSpring = new Spring({ height: -1, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);
  // const subjectSpring = spring({ height: -1, opacity: 1, x: 0, y: 0 }, SPRING_CONFIG_GROWING);

  let expanded = $state(true);
  let animating = $state(false);

  let height = $derived(subjectSpring.current.height);
  let opacity = $derived(subjectSpring.current.opacity);
  let x = $derived(subjectSpring.current.x);
  let y = $derived(subjectSpring.current.y);

  onMount(() => {
    heightValue = syncHeight(contentEl);
  });

  $effect(() => {
    const currentHeight = heightValue?.height.value;

    if (currentHeight) {
      if (currentHeight === height) {
        animating = false;
      }

      const isExpanded = untrack(() => expanded);
      setSpring(currentHeight, isExpanded);
    }
  });

  function setSpring(height: number, isExpanded: boolean) {
    const animate = untrack(() => animating);
    const newHeight = isExpanded ? height : 0;
    const existingHeight = untrack(() => subjectSpring.current.height);

    if (existingHeight === newHeight) {
      return;
    }

    Object.assign(subjectSpring, newHeight > existingHeight ? SPRING_CONFIG_GROWING : SPRING_CONFIG_SHRINKING);
    subjectSpring.set({ height: newHeight, opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : 20, y: isExpanded ? 0 : -20 }, { hard: !animate });
  }

  const setExpanded = (val: boolean) => {
    animating = true;
    expanded = val;
    setSpring(expanded ? heightValue!.height.value : 0, val);
  };

  function animateLabel(node: HTMLElement) {
    const height = node.offsetHeight;

    return {
      duration: 200,
      easing: cubicOut,
      css: t => `height: ${t * height}px; opacity: ${t};`
    };
  }
</script>

<div transition:animateLabel>
  <div class="p-2 hover:bg-muted/50 group flex items-center gap-2">
    <Button class={`${!subject.children.length ? "invisible" : ""}`} variant="ghost" size="icon" onclick={() => setExpanded(!expanded)}>
      <ChevronRightIcon class={`h-4 w-4 transition-[transform] ${expanded ? "rotate-90" : ""}`} />
    </Button>
    <span class="text-sm font-medium">{subject.name}</span>
    <Button variant="ghost" size="icon" class="invisible group-hover:visible" onclick={() => editSubject(subject)}>
      <PencilIcon class="h-4 w-4" />
    </Button>
    <!-- <SubjectLabelDisplay childSubjects={subject.children} {expanded} {setExpanded} onEdit={() => editSubject(subject)} item={subject} /> -->
  </div>
  <div style="height: {animating ? height + 'px' : 'auto'}; overflow: hidden">
    <div bind:this={contentEl} style="opacity: {opacity}; transform: translate3d({x}px, {y}px, 0)">
      {#if subject.children.length}
        <ul class="ml-5" transition:animateLabel>
          {#each subject.children as s (s.id)}
            <li>
              <Self subject={s} {editSubject} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
