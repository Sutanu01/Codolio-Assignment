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
import type { Question } from "@/types/sheet";
import { SortableQuestionItem } from "./SortableQuestionItem";

interface QuestionListProps {
  topicId: string;
  subTopicId: string;
  questions: Question[];
}

export function QuestionList({ topicId, subTopicId, questions }: QuestionListProps) {
  const { reorderQuestions } = useSheetStore();
  const questionIds = questions.map((q) => q.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = questionIds.indexOf(active.id as string);
    const toIndex = questionIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;
    reorderQuestions(topicId, subTopicId, fromIndex, toIndex);
  }

  if (questions.length === 0) {
    return (
      <p className="py-1 text-xs text-ink-400 dark:text-ink-500">No questions yet.</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
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
    </DndContext>
  );
}
