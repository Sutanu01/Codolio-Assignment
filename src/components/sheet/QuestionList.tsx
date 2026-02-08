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
import type { Question, QuestionStatus } from "@/types/sheet";
import { SortableQuestionItem } from "./SortableQuestionItem";
import { cn } from "@/lib/utils";
import { Check, GripVertical } from "lucide-react";

const STATUS_LABEL: Record<QuestionStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function QuestionDragPreview({ question }: { question: Question }) {
  const status = question.status ?? "todo";
  const tags = question.tags ?? [];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-ink-200 bg-white py-1.5 px-2 shadow-card dark:border-ink-600 dark:bg-ink-700">
      <span className="rounded p-0.5 text-ink-400 dark:text-ink-500">
        <GripVertical className="h-3.5 w-3.5" />
      </span>
      <span
        className={cn(
          "rounded border px-1.5 py-0.5 text-xs font-medium",
          status === "done" &&
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
          status !== "done" &&
            "border-ink-200 bg-ink-50 text-ink-600 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-300"
        )}
      >
        {status === "done" ? <Check className="h-3 w-3" /> : STATUS_LABEL[status]}
      </span>
      <span className="text-sm text-ink-700 dark:text-ink-200">{question.title}</span>
      {tags.length > 0 && (
        <span className="flex gap-1">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded bg-ink-100 px-1.5 py-0.5 text-xs text-ink-600 dark:bg-ink-600 dark:text-ink-300"
            >
              {t}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

interface QuestionListProps {
  topicId: string;
  subTopicId: string;
  questions: Question[];
}

export function QuestionList({ topicId, subTopicId, questions }: QuestionListProps) {
  const { reorderQuestions } = useSheetStore();
  const questionIds = questions.map((q) => q.id);
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
    const fromIndex = questionIds.indexOf(active.id as string);
    const toIndex = questionIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderQuestions(topicId, subTopicId, fromIndex, toIndex);
  }

  const activeQuestion = activeId ? questions.find((q) => q.id === activeId) : null;

  if (questions.length === 0) {
    return (
      <p className="py-1 text-xs text-ink-400 dark:text-ink-500">No questions yet.</p>
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
      <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
        <ul className="space-y-1">
          {questions.map((q) => (
            <SortableQuestionItem
              key={q.id}
              topicId={topicId}
              subTopicId={subTopicId}
              question={q}
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeQuestion ? <QuestionDragPreview question={activeQuestion} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
