<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = {
    size?: "default" | "med" | "sm";
    theme?: "primary" | "info" | "success" | "danger" | "default";
    running?: boolean;
    icon?: boolean;
    softDisable?: boolean;
    href?: string | null;
    children: Snippet;
  } & HTMLButtonAttributes;

  let {
    size = "default",
    theme,
    disabled,
    running = false,
    icon = false,
    softDisable = false,
    href,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  // export let theme: "primary" | "info" | "success" | "danger" | "default" = "default";
  // export let size: "default" | "med" | "sm" = "default";
  // export let disabled: boolean | undefined = undefined;
  // export let softDisable: boolean = false;
  // export let icon: boolean = false;

  // let className = "";
  // export { className as class };

  // const { className: ignore, ...rest } = $$restProps;

  //export let href: string | null | undefined = undefined;

  let defaultButton = $derived(theme === "default");
  let isPrimary = $derived(theme === "primary");
  let isInfo = $derived(theme === "info");
  let isSuccess = $derived(theme === "success");
  let isDanger = $derived(theme === "danger");

  let paddingTop = $derived(size === "default" ? "py-1.5" : "py-1");
  let paddingSide = $derived(icon ? (size === "default" ? "px-1.5" : "px-1") : size === "default" ? "px-3" : "px-1.5");
  let fontSize = $derived(size === "default" ? "text-base" : size === "med" ? "text-sm" : "text-xs leading-3");

  let addedClasses = $derived([paddingTop, paddingSide, fontSize, className].join(" "));

  let type: "a" | "button" = $derived(disabled ? "button" : href ? "a" : "button");
</script>

<svelte:element
  this={type}
  role="button"
  tabindex="0"
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
  class:bg-info-5={isInfo}
  class:border-info-5={isInfo}
  class:text-info-10={isInfo}
  class:focus:shadow-info-7={isInfo}
  class:bg-white={defaultButton}
  class:border-neutral-400={defaultButton}
  class:text-neutral-700={defaultButton}
  class:leading-none={icon}
  class:focus:shadow-md={size === "default" || size === "med"}
  class:focus:shadow-sm={size === "sm"}
  class:cursor-not-allowed={disabled && !softDisable}
  class:cursor-default={disabled && softDisable}
  class:opacity-50={disabled && !softDisable}
  class:opacity-70={disabled && softDisable}
  class={`flex items-center m-0 rounded border transition-[box-shadow,opacity] ${addedClasses}`}
  disabled={type === "button" ? disabled : undefined}
  href={type === "a" ? href : undefined}
  {...rest}
>
  {@render children()}
</svelte:element>
