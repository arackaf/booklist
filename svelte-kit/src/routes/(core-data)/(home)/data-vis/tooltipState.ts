import { derived, writable } from "svelte/store";
import type { Data, Position } from "./bar-chart/tooltip";
import Tooltip from "./bar-chart/Tooltip.svelte";

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
      const target = document.createElement("div");
      target.style.display = "inline-block";
      document.body.appendChild(target);

      const temp = new Tooltip({
        target: target,
        props: { shown: true, measure: true, x: "0", y: "0", css: "", ...payload }
      });

      console.log("dim", target.clientWidth, target.clientHeight);

      temp.$destroy();
      target.parentElement?.removeChild(target);

      state.set({ shown: true, ...coord, payload });
    },
    hide() {
      state.update(current => ({ ...current, shown: false }));
    },
    currentState: readOnlyState
  };
}
