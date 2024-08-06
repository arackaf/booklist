import type { Position } from "./tooltip";

const OFFSET = 10;

export function positionTooltip(anchorNode: DOMRect, position: Position): { x: string; y: string; css: string } {
  console.log({ position });
  switch (position) {
    case "right-start":
      return { x: `${anchorNode.x + anchorNode.width + OFFSET}px`, y: `${anchorNode.y}px`, css: "" };
    case "left-start":
      return {
        x: `calc(${anchorNode.x}px - 100% - ${OFFSET}px)`,
        y: `${anchorNode.y}px`,
        css: `transform: translate(calc(-100% - ${OFFSET}px), 0)`
      };
    case "top":
      return {
        x: `calc(${anchorNode.x + anchorNode.width / 2}px - 50%)`,
        y: `calc(${anchorNode.y}px - 100% - ${OFFSET}px)`,
        css: `transform: translate(-50%, calc(-100% - ${OFFSET}px))`
      };
    case "top-right":
      return {
        x: `calc(${anchorNode.x + anchorNode.width}px - 100%)`,
        y: `calc(${anchorNode.y}px - 100% - ${OFFSET}px)`,
        css: `transform: translate(-100%, calc(-100% - ${OFFSET}px))`
      };
    case "top-left":
      return {
        x: `${anchorNode.x}px`,
        y: `calc(${anchorNode.y}px - 100% - ${OFFSET}px)`,
        css: `transform: translate(-100%, calc(-100% - ${OFFSET}px))`
      };
  }
  return { x: "", y: "", css: "" };
}
