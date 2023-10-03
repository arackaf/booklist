import { createPopper, type Placement, type Instance as PopperInstance } from "@popperjs/core";
import Tooltip from "./Tooltip.svelte";
import type { Subject } from "$data/types";

export type Position = "left" | "right" | "top" | "top-left" | "top-right";
export type PopperOptions = { position: Position; data: Data; drilldown: any; removeBar: (id: string) => void; barWidth: number };

class TooltipHoverState {
  #isDead: boolean = true;
  #isDying: boolean = true;
  #overBar: boolean = false;
  #overtooltip: boolean = false;
  #cancellationToken: any = null;

  #popper: PopperInstance | null = null;
  #div: HTMLDivElement | null = null;

  activate(popper: PopperInstance, div: HTMLDivElement) {
    this.#isDead = false;
    this.#popper = popper;
    this.#div = div;
    this.#div?.classList.add("exists");

    requestAnimationFrame(() => {
      this.#div?.classList.add("show");
    });
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
    if (this.#isDying) {
      clearTimeout(this.#cancellationToken);
      this.#cancellationToken = null;
      this.#isDying = false;
      this.#div?.classList.add("show");
    }
  }

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
    this.#isDying = true;
    this.#div?.classList.remove("show");

    this.#cancellationToken = setTimeout(() => {
      if (this.#isDying) {
        this.#popper?.destroy();
        if (this.#div) {
          this.#div.parentElement?.removeChild(this.#div);
        }
        this.#isDead = true;
      }
    }, 200);
  }
}

export type Data = {
  groupId: string;
  count: number;
  display: string;
  childSubjects: Subject[];
  barWidth: number;
};

export const tooltip = (node: SVGElement, props: PopperOptions) => {
  const { data, drilldown, removeBar, barWidth } = props;
  let { position } = props;

  const barRect = node.getBoundingClientRect();

  const tooltipMabager = new TooltipHoverState();

  function initializePopper() {
    const div = document.createElement("div");
    div.classList.add("popper-tooltip");
    document.body.appendChild(div);

    new Tooltip({
      target: div,
      props: { position, data, drilldown, removeBar, barElement: node }
    });

    const placementMap: { [keys in Position]: Placement } = {
      left: "left-start",
      top: "top",
      "top-right": "top-end",
      "top-left": "top-start",
      right: "right-start"
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
    },
    update(props: any) {
      position = props.position;
    }
  };
};
