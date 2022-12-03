declare namespace svelte.JSX {
  interface HTMLAttributes<T extends "form"> {
    onformdata?: (event: any) => any;
  }
}
