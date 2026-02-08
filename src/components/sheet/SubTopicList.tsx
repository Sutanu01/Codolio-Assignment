"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSheetStore } from "@/store/sheet-store";
import type { SubTopic } from "@/types/sheet";
import { SortableSubTopicItem } from "./SortableSubTopicItem";

interface SubTopicListProps {
  topicId: string;
  subTopics: SubTopic[];
}

export function SubTopicList({ topicId, subTopics }: SubTopicListProps) {
  const { reorderSubTopics } = useSheetStore();
  const subTopicIds = subTopics.map((s) => s.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = subTopicIds.indexOf(active.id as string);
    const toIndex = subTopicIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderSubTopics(topicId, fromIndex, toIndex);
  }

  if (subTopics.length === 0) {
    return (
      <p className="py-2 text-sm text-ink-400 dark:text-ink-500">No sub-topics yet. Add one above.</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={subTopicIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {subTopics.map((sub) => (
            <SortableSubTopicItem
              key={sub.id}
              topicId={topicId}
              subTopic={sub}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
