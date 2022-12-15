import debounce from "lodash.debounce";
import { createPopper, type Placement } from "@popperjs/core";
import Tooltip from "./Tooltip.svelte";
import type { Subject } from "$data/types";

export type Position = "left" | "right" | "top";
export type PopperOptions = { position: Position; data: Data; drilldown: any };

export type Data = {
  count: number;
  display: string;
  childSubjects: Subject[];
};

export const tooltip = <T extends Record<string, any>>(node: any, props: PopperOptions) => {
  const { position, data, drilldown } = props;
  const div = document.createElement("div");
  div.classList.add("popper-tooltip");
  document.body.appendChild(div);

  new Tooltip({
    target: div,
    props: { position, data, drilldown }
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

  const updateTooltip = debounce(() => {
    console.log("Popper update");
  }, 20);

  return {};
};
