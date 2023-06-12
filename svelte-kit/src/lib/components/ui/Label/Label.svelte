<script lang="ts">
  let className = "";
  export { className as class };

  export let display = "inline-block";
  export let theme: "default" | "error" | "success" = "default";
  export let colors: { backgroundColor: string; textColor: string } | null = null;

  export let style = "";
  let addedClasses = className;
  let colorStyles = "";

  $: {
    if (colors) {
      colorStyles = `background-color: ${colors.backgroundColor}; color: ${colors.textColor}`;
    } else {
      if (theme === "default") {
        addedClasses = className + " bg-neutral-500 text-white ";
      } else if (theme === "error") {
        addedClasses = className + " bg-red-600 text-white ";
      } else if (theme === "success") {
        addedClasses = className + " bg-green-600 text-white ";
      }
    }
  }
</script>

<span
  style="{colorStyles} {style}"
  class="text-[11px] font-bold leading-[normal] whitespace-nowrap py-[3px] px-[6px] rounded-[3px] noselect {display} {addedClasses}"
>
  <slot />
</span>
