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
    x: 0,
    y: 0,
    payload: {} as TooltipPayload,
    bound: null as unknown as SVGElement
  });

  const readOnlyState = derived(state, currentState => currentState);
  const result = {
    show(bindTo: SVGElement, payload: TooltipPayload) {
      const { w, h } = getTooltipDimensions(payload);

      const bound = bindTo.getBoundingClientRect();
      const coord = positionTooltip(bound, payload.position, { w, h });

      state.set({ shown: true, ...coord, bound: bindTo, payload });
    },
    hide() {
      state.update(current => ({ ...current, shown: false }));
    },
    reShow() {
      state.update(current => ({ ...current, shown: true }));
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
