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
import { TopicSection } from "./TopicSection";
import type { Topic } from "@/types/sheet";
import { ChevronDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const TOPIC_TINTS = [
  "bg-tint-amber border-amber-200/60",
  "bg-tint-sky border-sky-200/60",
  "bg-tint-emerald border-emerald-200/60",
  "bg-tint-violet border-violet-200/60",
  "bg-tint-rose border-rose-200/60",
] as const;

function TopicOverlay({ topic, index }: { topic: Topic; index: number }) {
  const n = topic.subTopics.reduce((s, st) => s + st.questions.length, 0);
  return (
    <div
      className={cn(
        "rounded-lg border shadow-lg dark:border-ink-600 dark:bg-ink-800",
        "w-[min(100vw-2rem,54rem)] min-w-[280px] box-border",
        TOPIC_TINTS[index % TOPIC_TINTS.length]
      )}
    >
      <div className="flex items-center gap-2 border-b border-ink-100 px-4 py-3 dark:border-ink-600">
        <GripVertical className="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-500" />
        <span className="min-w-0 flex-1 text-sm font-medium text-ink-700 dark:text-ink-200">{topic.title}</span>
        {n > 0 && <span className="shrink-0 text-xs text-ink-500 dark:text-ink-400">{n}</span>}
        <ChevronDown className="h-4 w-4 shrink-0 text-ink-400 dark:text-ink-500" />
      </div>
    </div>
  );
}

export function SortableTopicList() {
  const { sheet, reorderTopics } = useSheetStore();
  const topics = sheet?.topics ?? [];
  const topicIds = topics.map((t) => t.id);
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
    const fromIndex = topicIds.indexOf(active.id as string);
    const toIndex = topicIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderTopics(fromIndex, toIndex);
  }

  const activeTopic = activeId ? topics.find((t) => t.id === activeId) : null;
  const activeIndex = activeTopic ? topics.findIndex((t) => t.id === activeId) : 0;

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
      <SortableContext items={topicIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {topics.map((topic, index) => (
            <TopicSection key={topic.id} topic={topic} index={index} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={null} modifiers={[restrictToVerticalAxis, restrictToWindowEdges, clampVerticalDrag]}>
        {activeTopic ? <TopicOverlay topic={activeTopic} index={activeIndex} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
