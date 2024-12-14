<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    error?: boolean;
    inputEl?: any;
    value?: string;
    size?: "sm" | "default";
  } & Omit<HTMLInputAttributes, "size">;

  let { error, class: className, inputEl = $bindable(), value = $bindable(""), size = "default", ...rest }: Props = $props();
</script>

<input
  class:border-neutral-400={!error}
  class:border-danger-5={error}
  class:focus:shadow-md={!error}
  class:focus:shadow-sm={error}
  class:focus:shadow-danger-7={error}
  class:h-8={size === "sm"}
  class:h-9={size === "default"}
  class="bg-white text-neutral-600 border rounded py-1 px-3 text-base block w-full transition-box-shadow {className}"
  bind:this={inputEl}
  bind:value
  {...rest}
/>
