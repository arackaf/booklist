<script lang="ts">
  import type { LabelColors } from "$lib/components/subjectsAndTags/types";

  type Props = {
    class?: string;
    theme?: "default" | "error" | "success";
    colors?: LabelColors | null;
    style?: string;
  };
  let { class: className = "", theme = "default", colors = null, style = "" }: Props = $props();

  let colorStyles = $derived(colors ? `background-color: ${colors.backgroundColor}; color: ${colors.textColor};` : "");
  let addedClasses = $derived.by(() => {
    if (colors) {
      return className;
    }
    if (theme === "default") {
      return className + " bg-neutral-500 text-white ";
    } else if (theme === "error") {
      return className + " bg-red-600 text-white ";
    } else if (theme === "success") {
      return className + " bg-green-600 text-white ";
    }
  });
</script>

<span
  style="{colorStyles} {style}"
  class="text-[11px] font-bold leading-[normal] whitespace-nowrap py-[3px] px-[6px] rounded-[3px] noselect inline-block {addedClasses}"
>
  <slot />
</span>
