import type { TooltipPayload } from "../tooltipState";
import Tooltip from "../Tooltip.svelte";

import type { Subject } from "$data/types";

export type Position = "absolute-left" | "absolute-right" | "top" | "top-left" | "top-right" | "right-start" | "left-start";

export type PopperOptions = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
  hoverTarget?: Element;
  onShow?: () => void;
  onHide?: () => void;
};

export type Data = {
  groupId: string;
  count: number;
  display: string;
  childSubjects: Subject[];
  entries: { name: string; color: string }[];
};

const OFFSET = 10;

export function getTooltipDimensions(payload: TooltipPayload) {
  const target = document.createElement("div");
  target.style.display = "inline-block";
  document.body.appendChild(target);

  const temp = new Tooltip({
    target: target,
    props: { shown: true, measure: true, x: 0, y: 0, ...payload }
  });

  const tooltipWidth = target.clientWidth;
  const tooltipHeight = target.clientHeight;
  //console.log("dim", target.clientWidth, target.clientHeight);

  temp.$destroy();
  target.parentElement?.removeChild(target);

  return { w: tooltipWidth, h: tooltipHeight };
}

export function positionTooltip(anchorNode: DOMRect, position: Position, tooltipDimensions: { w: number; h: number }): { x: number; y: number } {
  // console.log({ position });
  const { w: tooltipWidth, h: tooltipHeight } = tooltipDimensions;
  switch (position) {
    case "right-start":
      return { x: anchorNode.x + anchorNode.width + OFFSET, y: anchorNode.y };
    case "left-start":
      return {
        x: anchorNode.x - tooltipWidth - OFFSET,
        y: anchorNode.y
        //css: `transform: translate(calc(-100% - ${OFFSET}px), 0)`
      };
    case "top":
      return {
        x: anchorNode.x + anchorNode.width / 2 - tooltipWidth / 2,
        y: anchorNode.y - tooltipHeight - OFFSET
        //css: `transform: translate(-50%, calc(-100% - ${OFFSET}px))`
      };
    case "top-right":
      return {
        x: anchorNode.x + anchorNode.width - tooltipWidth,
        y: anchorNode.y - tooltipHeight - OFFSET
        //css: `transform: translate(-100%, calc(-100% - ${OFFSET}px))`
      };
    case "top-left":
      return {
        x: anchorNode.x,
        y: anchorNode.y - tooltipHeight - OFFSET
        //css: `transform: translate(-100%, calc(-100% - ${OFFSET}px))`
      };
    case "absolute-right":
      return { x: anchorNode.x + OFFSET, y: anchorNode.y - tooltipDimensions.h / 2 };
    case "absolute-left":
      return { x: anchorNode.x - tooltipDimensions.w - OFFSET, y: anchorNode.y - tooltipDimensions.h / 2 };
  }
  return { x: 0, y: 0 };
}
