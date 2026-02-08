import type { Modifier } from "@dnd-kit/core";

const MAX_VERTICAL_DELTA = 3000;

export const clampVerticalDrag: Modifier = ({ transform }) => {
  const y = Math.max(-MAX_VERTICAL_DELTA, Math.min(MAX_VERTICAL_DELTA, transform.y));
  return { ...transform, y };
};
