"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableListCollision } from "@/lib/sortable-collision";
import { clampVerticalDrag } from "@/lib/sortable-modifiers";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSheetStore } from "@/store/sheet-store";
import type { SubTopic } from "@/types/sheet";
import { SortableSubTopicItem } from "./SortableSubTopicItem";
import { GripVertical } from "lucide-react";

function SubTopicOverlay({ subTopic }: { subTopic: SubTopic }) {
  return (
    <div className="w-full min-w-[200px] max-w-[min(100vw-2rem,42rem)] rounded-md border border-ink-200 bg-white/95 shadow-lg dark:border-ink-600 dark:bg-ink-700/90">
      <div className="flex items-center gap-2 border-b border-ink-200 px-3 py-2 dark:border-ink-600">
        <GripVertical className="h-3.5 w-3.5 text-ink-400 dark:text-ink-500" />
        <h3 className="text-sm font-medium text-ink-700 dark:text-ink-200">{subTopic.title}</h3>
      </div>
    </div>
  );
}

interface SubTopicListProps {
  topicId: string;
  subTopics: SubTopic[];
}

export function SubTopicList({ topicId, subTopics }: SubTopicListProps) {
  const { reorderSubTopics } = useSheetStore();
  const subTopicIds = subTopics.map((s) => s.id);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
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
      collisionDetection={sortableListCollision}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[
        restrictToVerticalAxis,
        restrictToFirstScrollableAncestor,
        restrictToWindowEdges,
        clampVerticalDrag,
      ]}
    >
      <SortableContext items={subTopicIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
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
        {activeSubTopic ? <SubTopicOverlay subTopic={activeSubTopic} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
