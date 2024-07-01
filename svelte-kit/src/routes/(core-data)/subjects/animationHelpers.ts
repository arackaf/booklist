import { quadIn } from "svelte/easing";

export function exitStart(evt: any) {
  evt.target.style.height = "0";
  evt.target.style.overflow = "visible";
}

export const scaleTransitionProps = { duration: 150, easing: quadIn };
