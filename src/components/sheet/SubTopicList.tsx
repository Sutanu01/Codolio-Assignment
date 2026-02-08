"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSheetStore } from "@/store/sheet-store";
import type { SubTopic } from "@/types/sheet";
import { SortableSubTopicItem } from "./SortableSubTopicItem";
import { GripVertical } from "lucide-react";

interface SubTopicListProps {
  topicId: string;
  subTopics: SubTopic[];
}

function SubTopicDragPreview({ subTopic }: { subTopic: SubTopic }) {
  return (
    <div className="rounded-md border border-ink-200 bg-white/95 shadow-card dark:border-ink-600 dark:bg-ink-700/90">
      <div className="flex items-center gap-2 border-b border-ink-200 px-3 py-2 dark:border-ink-600">
        <span className="rounded p-0.5 text-ink-400 dark:text-ink-500">
          <GripVertical className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-sm font-medium text-ink-700 dark:text-ink-200">{subTopic.title}</h3>
      </div>
    </div>
  );
}

export function SubTopicList({ topicId, subTopics }: SubTopicListProps) {
  const { reorderSubTopics } = useSheetStore();
  const subTopicIds = subTopics.map((s) => s.id);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const fromIndex = subTopicIds.indexOf(active.id as string);
    const toIndex = subTopicIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderSubTopics(topicId, fromIndex, toIndex);
  }

  const activeSubTopic = activeId ? subTopics.find((s) => s.id === activeId) : null;

  if (subTopics.length === 0) {
    return (
      <p className="py-2 text-sm text-ink-400 dark:text-ink-500">No sub-topics yet. Add one above.</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
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
      <DragOverlay dropAnimation={null}>
        {activeSubTopic ? <SubTopicDragPreview subTopic={activeSubTopic} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
