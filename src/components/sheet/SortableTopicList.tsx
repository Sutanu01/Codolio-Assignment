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
import { TopicSection } from "./TopicSection";

export function SortableTopicList() {
  const { sheet, reorderTopics } = useSheetStore();
  const topics = sheet?.topics ?? [];
  const topicIds = topics.map((t) => t.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = topicIds.indexOf(active.id as string);
    const toIndex = topicIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderTopics(fromIndex, toIndex);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={topicIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <TopicSection key={topic.id} topic={topic} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
