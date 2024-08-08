import { createPopper, type Placement, type Instance as PopperInstance } from "@popperjs/core";
import type { Subject } from "$data/types";

import Tooltip from "../Tooltip.svelte";

export type Position = "absolute-left" | "absolute-right" | "top" | "top-left" | "top-right" | "right-start" | "left-start";

export type PopperOptions = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
  hoverTarget?: Element;
  onShow?: () => void;
  onHide?: () => void;
};

class TooltipHoverState {
  #isDead: boolean = true;
  #isDying: boolean = true;
  #overBar: boolean = false;
  #overtooltip: boolean = false;
  #activationCancellationToken: any = null;
  #deathCancellationToken: any = null;
  #onShow?: () => void;
  #onHide?: () => void;

  #popper: PopperInstance | null = null;
  #div: HTMLDivElement | null = null;

  activate(popper: PopperInstance, div: HTMLDivElement, onShow?: () => void, onHide?: () => void) {
    this.#isDead = false;
    this.#popper = popper;
    this.#div = div;

    this.#onShow = onShow;
    this.#onHide = onHide;

    this.#isDying = false;
    this.#div?.classList.add("exists");

    clearTimeout(this.#deathCancellationToken);
    this.#activationCancellationToken = setTimeout(() => {
      this.#div?.classList.add("show");
    }, 200);
  }

  hoverTooltip = () => {
    this.resurrectIfNeeded();
    this.#overtooltip = true;
    this.#overBar = false;
  };
  hoverBar = () => {
    this.resurrectIfNeeded();
    this.#overBar = true;
    this.#overtooltip = false;
  };

  resurrectIfNeeded() {
    this.#onShow?.();
    if (this.#isDying) {
      clearTimeout(this.#deathCancellationToken);
      this.#deathCancellationToken = null;
      this.#isDying = false;
      this.#div?.classList.add("show");
    }
  }

  leaveTooltip = () => {
    this.#overtooltip = false;
    this.startTooltipRemoval();
  };
  leaveBar = () => {
    this.#overBar = false;
    this.startTooltipRemoval();
  };

  startTooltipRemoval() {
    this.#onHide?.();
    setTimeout(() => {
      if (this.isOff()) {
        this.destroy();
      }
    }, 100);
  }

  isOff = () => !this.#overBar && !this.#overtooltip;
  isDead = () => this.#isDead;

  destroy() {
    this.#isDying = true;
    this.#div?.classList.remove("show");

    clearTimeout(this.#activationCancellationToken);
    this.#deathCancellationToken = setTimeout(() => {
      if (this.#isDying) {
        this.#popper?.destroy();
        if (this.#div) {
          this.#div.parentElement?.removeChild(this.#div);
        }
        this.#isDead = true;
      }
    }, 150);
  }
}

export type Data = {
  groupId: string;
  count: number;
  display: string;
  childSubjects: Subject[];
  entries: { name: string; color: string }[];
};

export const tooltip = (node: SVGElement, props: PopperOptions) => {
  const { data, drilldown, remove, hoverTarget = node } = props;
  let { position } = props;

  const tooltipMabager = new TooltipHoverState();

  function initializePopper() {
    const div = document.createElement("div");
    div.classList.add("popper-tooltip");
    document.body.appendChild(div);

    new Tooltip({
      target: div,
      props: { position, data, drilldown, remove }
    });

    const placementMap: { [keys in Position]: Placement } = {
      top: "top",
      "top-right": "top-end",
      "top-left": "top-start",
      left: "left",
      "left-start": "left-start",
      right: "right",
      "right-start": "right-start"
    };

    const popperPlacement: Placement = placementMap[position];
    const popper = createPopper(node, div, {
      placement: popperPlacement,
      strategy: "absolute",
      modifiers: [
        // To have right tooltips show just inside the left boubdary, we position on the left, and transform 100% to slide it over.
        // Flip prevents the tooltip from moving when popper (not knowing about the transform) thinks it's out of room.
        {
          name: "flip",
          enabled: false
        }
      ]
    });

    tooltipMabager.activate(popper, div, props.onShow, props.onHide);

    const contentDiv = div;
    contentDiv.addEventListener("mouseenter", () => {
      tooltipMabager.hoverTooltip();
    });
    contentDiv.addEventListener("mouseleave", () => {
      tooltipMabager.leaveTooltip();
    });
  }

  // TODO: optimize this and remove when not needed
  hoverTarget.addEventListener("mousemove", () => {
    if (tooltipMabager.isDead()) {
      initializePopper();
    } else {
      tooltipMabager.hoverBar();
    }
  });
  hoverTarget.addEventListener("mouseenter", () => {
    if (tooltipMabager.isDead()) {
      initializePopper();
    } else {
      tooltipMabager.hoverBar();
    }
  });
  hoverTarget.addEventListener("mouseleave", () => {
    tooltipMabager.leaveBar();
  });

  return {
    destroy() {
      tooltipMabager.destroy();
    },
    update(props: any) {
      position = props.position;
    }
  };
};
