import { derived, get, writable } from "svelte/store";
import { getTooltipDimensions, positionTooltip, type Data, type Position } from "./tooltipUtils";

export type TooltipPayload = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
};

export function createTooltipState() {
  const shownState = writable(false);
  const state = writable({
    x: 0,
    y: 0,
    payload: null as null | TooltipPayload,
    bound: null as unknown as SVGElement,
    skipDelay: false,
    onScreen: false
  });

  let leaveTimeout: NodeJS.Timer | null = null;
  let showTimeout: NodeJS.Timer | null = null;

  const readOnlyState = derived(state, currentState => currentState);

  function clearTimeouts() {
    clearTimeout(leaveTimeout!);
    clearTimeout(showTimeout!);

    leaveTimeout = null;
    showTimeout = null;
  }

  const result = {
    show(bindTo: SVGElement, payload: TooltipPayload) {
      const { w, h } = getTooltipDimensions(payload);

      const bound = bindTo.getBoundingClientRect();
      const coord = positionTooltip(bound, payload.position, { w, h });

      state.update(current => ({ ...current, ...coord, bound: bindTo, payload }));
      shownState.set(true);
    },
    tooltipHover() {
      clearTimeouts();
      shownState.set(true);
    },
    onHover(node: SVGElement, hoveringPayload: TooltipPayload) {
      const currentState = get(this.currentState);
      clearTimeouts();

      if (hoveringPayload.data === currentState.payload?.data) {
        this.show(node, hoveringPayload);
      } else {
        showTimeout = setTimeout(() => {
          this.show(node, hoveringPayload);
        }, 75);
      }
    },
    onMouseLeave() {
      clearTimeouts();

      leaveTimeout = setTimeout(() => {
        this.hide();
      }, 200);
    },
    hide() {
      clearTimeouts();
      shownState.set(false);
    },
    tooltipGone() {
      state.update(val => ({ ...val, onScreen: false, payload: null }));
    },
    tooltipVisible() {
      state.update(val => ({ ...val, onScreen: true }));
    },
    currentState: readOnlyState,
    shownState
  };

  if (typeof window === "object") {
    window.addEventListener("scroll", () => {
      const isShown = get(shownState);
      const currentTooltipState = get(state);

      if (isShown) {
        result.show(currentTooltipState.bound, currentTooltipState.payload!);
      }
    });
  }

  return result;
}
