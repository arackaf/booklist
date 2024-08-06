import type { Position } from "./tooltip";

const OFFSET = 10;

export function positionTooltip(anchorNode: DOMRect, position: Position): { x: number; y: number; css: string } {
  switch (position) {
    case "right-start":
      return { x: anchorNode.x + anchorNode.width + OFFSET, y: anchorNode.y, css: "" };
    case "left-start":
      return { x: anchorNode.x, y: anchorNode.y, css: `transform: translate(calc(-100% - ${OFFSET}px), 0)` };
    case "top":
      return { x: anchorNode.x + anchorNode.width / 2, y: anchorNode.y, css: `transform: translate(-50%, calc(-100% - ${OFFSET}px))` };
    case "top-right":
      return { x: anchorNode.x + anchorNode.width, y: anchorNode.y, css: `transform: translate(-100%, calc(-100% - ${OFFSET}px))` };
  }
  return { x: 0, y: 0, css: "" };
}
