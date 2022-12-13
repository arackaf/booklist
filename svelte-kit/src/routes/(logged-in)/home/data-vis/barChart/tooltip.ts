import debounce from "lodash.debounce";
import { createPopper, type Placement } from "@popperjs/core";
import Tooltip from "./Tooltip.svelte";

export type Position = "left" | "right" | "top";
export type PopperOptions = { position: Position };

export const tooltip = <T extends Record<string, any>>(node: any, { position }: PopperOptions) => {
  const div = document.createElement("div");
  div.classList.add("popper-tooltip");
  document.body.appendChild(div);

  new Tooltip({
    target: div,
    props: { position, name: "Hello" }
  });

  const placementMap: { [keys in Position]: Placement } = {
    left: "left-start",
    top: "top",
    right: "right-start"
  };

  const popperPlacement: Placement = placementMap[position];
  const popper = createPopper(node, div, {
    placement: popperPlacement,
    strategy: "absolute"
  });

  node.addEventListener("mouseenter", () => {
    popper.update();
    div.classList.add("show");
  });
  //node.addEventListener("mouseleave", () => div.classList.remove("show"));

  const updateTooltip = debounce(() => {
    console.log("Popper update");
  }, 20);

  return {};
};
