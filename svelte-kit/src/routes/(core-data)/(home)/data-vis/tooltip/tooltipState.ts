import { derived, get, writable } from "svelte/store";
import { getTooltipDimensions, positionTooltip, type Data, type Position } from "./tooltipUtils";

export type TooltipPayload = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
};

export function createTooltipState() {
  const state = writable({
    shown: false,
    hovering: false,
    x: 0,
    y: 0,
    payload: {} as TooltipPayload,
    hoveringOnPayload: null as null | TooltipPayload,
    bound: null as unknown as SVGElement,
    skipDelay: false
  });

  const readOnlyState = derived(state, currentState => currentState);
  const result = {
    show(bindTo: SVGElement, payload: TooltipPayload) {
      const { w, h } = getTooltipDimensions(payload);

      const bound = bindTo.getBoundingClientRect();
      const coord = positionTooltip(bound, payload.position, { w, h });

      state.update(current => ({ ...current, shown: true, ...coord, bound: bindTo, payload }));
    },
    onHover(node: SVGElement, hoveringPayload: TooltipPayload) {
      state.update(current => ({ ...current, hovering: true, hoveringOnPayload: hoveringPayload }));
      setTimeout(() => {
        const currentState = get(this.currentState);
        if (currentState.hoveringOnPayload?.data === hoveringPayload.data) {
          this.show(node, hoveringPayload);
        }
      }, 500);
    },
    onMouseLeave(leavingData: Data) {
      state.update(current => ({ ...current, hovering: false, hoveringOnPayload: null }));

      setTimeout(() => {
        const currentState = get(this.currentState);
        // different tooltip has shown
        if (currentState.payload.data !== leavingData) {
          return;
        }
        if (currentState.hoveringOnPayload === null || currentState.hoveringOnPayload.data !== leavingData) {
          console.log("HIDE");
          this.hide();
        }
      }, 500);
    },
    hide(skipDelay = false) {
      state.update(current => ({ ...current, skipDelay, shown: false }));
    },
    reShow() {
      state.update(current => ({ ...current, shown: true }));
    },
    delaySkipped() {
      state.update(current => ({ ...current, skipDelay: false }));
    },
    currentState: readOnlyState
  };

  if (typeof window === "object") {
    window.addEventListener("scroll", () => {
      const currentTooltipState = get(state);
      if (currentTooltipState.shown) {
        result.show(currentTooltipState.bound, currentTooltipState.payload);
      }
    });
  }

  return result;
}
