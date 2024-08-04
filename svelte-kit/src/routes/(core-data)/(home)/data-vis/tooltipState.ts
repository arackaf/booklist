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
    y: 0
  });

  const readOnlyState = derived(state, currentState => currentState);
  return {
    payload: null as unknown as TooltipPayload,
    show(x: number, y: number, payload: TooltipPayload) {
      state.set({ shown: true, x, y });
      this.payload = payload;
    },
    hide() {
      state.set({ shown: false, x: 0, y: 0 });
    },
    currentState: readOnlyState
  };
}
