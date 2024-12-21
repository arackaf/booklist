import { ref } from "$lib/state/reactivityHelpers.svelte";
import { getTooltipDimensions, positionTooltip, type Data, type Position } from "./tooltipUtils";

export type TooltipPayload = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
};

export function createTooltipState() {
  let shownState = ref(false);
  const state = $state({
    x: 0,
    y: 0,
    payload: null as null | TooltipPayload,
    bound: null as unknown as SVGElement,
    skipDelay: false,
    onScreen: false
  });

  let leaveTimeout: NodeJS.Timer | null = null;
  let showTimeout: NodeJS.Timer | null = null;

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

      Object.assign(state, { ...coord, bound: bindTo, payload });
      shownState.value = true;
    },
    tooltipHover() {
      clearTimeouts();
      shownState.value = true;
    },
    onHover(node: SVGElement, hoveringPayload: TooltipPayload) {
      clearTimeouts();

      if (hoveringPayload.data.groupId === state.payload?.data.groupId) {
        shownState.value = true;
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
      shownState.value = false;
    },
    tooltipGone() {
      Object.assign(state, { onScreen: false, payload: null });
    },
    tooltipVisible() {
      Object.assign(state, { onScreen: true });
    },
    currentState: state,
    shownState
  };

  if (typeof window === "object") {
    window.addEventListener("scroll", () => {
      if (shownState) {
        result.show(state.bound, state.payload!);
      }
    });
  }

  return result;
}
