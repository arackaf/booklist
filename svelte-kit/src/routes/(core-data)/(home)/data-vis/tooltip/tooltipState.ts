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
    payload: null as null | TooltipPayload,
    hoveringOnPayload: null as null | TooltipPayload,
    bound: null as unknown as SVGElement,
    skipDelay: false
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

      state.update(current => ({ ...current, shown: true, ...coord, bound: bindTo, payload }));
    },
    tooltipHover() {
      clearTimeouts();
      state.update(current => ({ ...current, shown: true }));
    },
    onHover(node: SVGElement, hoveringPayload: TooltipPayload) {
      const currentState = get(this.currentState);
      clearTimeouts();
      if (hoveringPayload.data === currentState.payload?.data) {
        this.show(node, hoveringPayload);
      } else {
        state.update(current => ({ ...current, hovering: true, hoveringOnPayload: hoveringPayload }));
        showTimeout = setTimeout(() => {
          this.show(node, hoveringPayload);
        }, 500 /* TODO: 75 */);
      }
    },
    onMouseLeave() {
      clearTimeouts();
      state.update(current => ({ ...current, hovering: false, hoveringOnPayload: null }));

      leaveTimeout = setTimeout(() => {
        clearTimeouts();

        this.hide();
      }, 500 /* TODO 200 */);
    },
    hide(skipDelay = false) {
      state.update(current => ({ ...current, skipDelay, shown: false }));
    },
    tooltipGone() {
      state.update(val => ({ ...val, payload: null }));
    },
    currentState: readOnlyState
  };

  if (typeof window === "object") {
    window.addEventListener("scroll", () => {
      const currentTooltipState = get(state);
      if (currentTooltipState.shown) {
        result.show(currentTooltipState.bound, currentTooltipState.payload!);
      }
    });
  }

  return result;
}
