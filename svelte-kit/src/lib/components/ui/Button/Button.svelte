<script lang="ts">
  export let theme: "primary" | "success" | "danger" | "default" = "default";
  export let size: "default" | "med" | "sm" = "default";
  export let disabled: boolean = false;
  export let icon: boolean = false;

  let className = "";
  export { className as class };

  const { className: ignore, ...rest } = $$restProps;

  $: defaultButton = theme === "default";
  $: isPrimary = theme === "primary";
  $: isSuccess = theme === "success";
  $: isDanger = theme === "danger";

  $: paddingTop = size === "default" ? "py-1.5" : "py-1";
  $: paddingSide = icon ? (size === "default" ? "px-1.5" : "px-1") : size === "default" ? "px-3" : "px-1.5";
  $: fontSize = size === "default" ? "text-base" : size === "med" ? "text-sm" : "text-xs leading-3";

  $: addedClasses = [paddingTop, paddingSide, fontSize, className].join(" ");
</script>

<button
  class:bg-primary-5={isPrimary}
  class:border-primary-5={isPrimary}
  class:text-primary-10={isPrimary}
  class:focus:shadow-primary-7={isPrimary}
  class:bg-danger-5={isDanger}
  class:border-danger-5={isDanger}
  class:text-danger-10={isDanger}
  class:focus:shadow-danger-7={isDanger}
  class:bg-success-5={isSuccess}
  class:border-success-5={isSuccess}
  class:text-success-10={isSuccess}
  class:focus:shadow-success-7={isSuccess}
  class:bg-white={defaultButton}
  class:border-neutral-400={defaultButton}
  class:text-neutral-700={defaultButton}
  class:leading-none={icon}
  class:focus:shadow-md={size === "default" || size === "med"}
  class:focus:shadow-sm={size === "sm"}
  class:cursor-not-allowed={disabled}
  class:opacity-50={disabled}
  class={`flex items-center m-0 rounded border transition-[box-shadow,opacity] ${addedClasses}`}
  {disabled}
  on:click
  {...rest}
>
  <slot />
</button>
