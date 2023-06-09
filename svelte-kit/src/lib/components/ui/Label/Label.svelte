<script lang="ts">
  let className = "";
  export { className as class };

  export let display = "inline-block";
  export let theme: "default" | "error" | "success" = "default";

  let addedClasses = "";

  $: {
    if (theme === "default") {
      addedClasses = className + " bg-neutral-500 text-white ";
    } else if (theme === "error") {
      addedClasses = className + " bg-red-600 text-white ";
    } else if (theme === "success") {
      addedClasses = className + " bg-green-600 text-white ";
    }
  }
</script>

<div class="text-[11px] font-bold leading-[normal] whitespace-nowrap py-[3px] px-[6px] rounded-[3px] {display} {addedClasses}">
  <slot />
</div>
