import { createPopper, type Placement, type Instance as PopperInstance } from "@popperjs/core";
import Tooltip from "./Tooltip.svelte";
import type { Subject } from "$data/types";

export type Position = "left" | "right" | "top";
export type PopperOptions = { position: Position; data: Data; drilldown: any; removeBar: (id: string) => void };

class TooltipHoverState {
  #isDead: boolean = true;
  #overBar: boolean = false;
  #overtooltip: boolean = false;

  #popper: PopperInstance | null = null;
  #div: HTMLDivElement | null = null;

  activate(popper: PopperInstance, div: HTMLDivElement) {
    this.#isDead = false;
    this.#popper = popper;
    this.#div = div;
  }

  hoverTooltip = () => {
    this.#overtooltip = true;
    this.#overBar = false;
  };
  hoverBar = () => {
    this.#overBar = true;
    this.#overtooltip = false;
  };

  leaveTooltip = () => {
    this.#overtooltip = false;
    this.check();
  };
  leaveBar = () => {
    this.#overBar = false;
    this.check();
  };

  check() {
    setTimeout(() => {
      if (this.isOff()) {
        this.destroy();
      }
    }, 100);
  }

  isOff = () => !this.#overBar && !this.#overtooltip;
  isDead = () => this.#isDead;

  destroy() {
    this.#popper?.destroy();
    if (this.#div) {
      this.#div.parentElement?.removeChild(this.#div);
    }
    this.#isDead = true;
  }
}

export type Data = {
  groupId: string;
  count: number;
  display: string;
  childSubjects: Subject[];
};

export const tooltip = (node: any, props: PopperOptions) => {
  const { position, data, drilldown, removeBar } = props;

  const tooltipMabager = new TooltipHoverState();

  function initializePopper() {
    const div = document.createElement("div");
    div.classList.add("popper-tooltip");
    document.body.appendChild(div);

    new Tooltip({
      target: div,
      props: { position, data, drilldown, removeBar }
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

    div.classList.add("show");

    tooltipMabager.activate(popper, div);

    const contentDiv = div.firstElementChild!;
    contentDiv.addEventListener("mouseenter", tooltipMabager.hoverTooltip);
    contentDiv.addEventListener("mouseleave", () => {
      tooltipMabager.leaveTooltip();
    });
  }

  node.addEventListener("mouseenter", () => {
    if (tooltipMabager.isDead()) {
      initializePopper();
    } else {
      tooltipMabager.hoverBar();
    }
  });
  node.addEventListener("mouseleave", () => {
    tooltipMabager.leaveBar();
  });

  return {
    destroy() {
      tooltipMabager.destroy();
    }
  };
};
