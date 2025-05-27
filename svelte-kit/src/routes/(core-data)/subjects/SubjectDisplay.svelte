<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Spring } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import type { FullSubject, Subject } from "$data/types";

  import { syncHeight } from "$lib/util/animationHelpers.svelte";

  import Self from "./SubjectDisplay.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ChevronRightIcon, TagIcon } from "lucide-svelte";

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
  <div class="p-2 hover:bg-muted/50 flex items-center gap-2">
    <Button class={!subject.children.length ? "invisible" : ""} variant="ghost" size="icon" onclick={() => setExpanded(!expanded)}>
      <ChevronRightIcon class="h-4 w-4 transition-[transform] {expanded ? 'rotate-90' : ''}" />
    </Button>
    <div class="flex">
      <div class="w-7 self-stretch my-2 rounded flex items-center justify-center h-6" style="background-color: {subject.backgroundColor};">
        <TagIcon class="h-4 w-4" style="color: {subject.textColor}" />
      </div>
      <Button variant="ghost" class="hover:bg-transparent p-2" onclick={() => editSubject(subject)}>
        <span class="text-sm font-medium">{subject.name}</span>
      </Button>
    </div>
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
