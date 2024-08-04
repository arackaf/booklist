import type { Position } from "./tooltip";

const OFFSET = 10;

export function positionTooltip(anchorNode: DOMRect, position: Position): { x: number; y: number } {
  switch (position) {
    case "right-start":
      return { x: anchorNode.x + anchorNode.width + OFFSET, y: anchorNode.y };
  }
  return { x: 0, y: 0 };
}
