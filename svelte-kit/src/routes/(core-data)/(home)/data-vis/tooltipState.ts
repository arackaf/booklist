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
    x: 0,
    y: 0,
    css: "" as string,
    payload: {} as TooltipPayload
  });

  const readOnlyState = derived(state, currentState => currentState);
  return {
    show(coord: { x: number; y: number; css: string }, payload: TooltipPayload) {
      state.set({ shown: true, ...coord, payload });
    },
    hide() {
      state.update(current => ({ ...current, shown: false }));
    },
    currentState: readOnlyState
  };
}
