import { closestCenter, pointerWithin, rectIntersection } from "@dnd-kit/core";
import type { CollisionDetection } from "@dnd-kit/core";

export const sortableListCollision: CollisionDetection = (args) => {
  const activeId = args.active.id;
  const notSelf = (c: { id: unknown }) => c.id !== activeId;

  const byIntersection = rectIntersection(args).filter(notSelf);
  if (byIntersection.length > 0) return byIntersection;

  const byPointer = pointerWithin(args).filter(notSelf);
  if (byPointer.length > 0) return byPointer;

  return closestCenter(args).filter(notSelf);
};
