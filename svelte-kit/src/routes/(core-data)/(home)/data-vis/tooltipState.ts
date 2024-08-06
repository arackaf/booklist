import { derived, writable } from "svelte/store";
import type { Data, Position } from "./bar-chart/tooltip";

type TooltipPayload = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
};

export function createTooltipState() {
  const state = writable({
    shown: false,
    x: "",
    y: "",
    css: "" as string,
    payload: {} as TooltipPayload
  });

  const readOnlyState = derived(state, currentState => currentState);
  return {
    show(coord: { x: string; y: string; css: string }, payload: TooltipPayload) {
      state.set({ shown: true, ...coord, payload });
    },
    hide() {
      state.update(current => ({ ...current, shown: false }));
    },
    currentState: readOnlyState
  };
}
