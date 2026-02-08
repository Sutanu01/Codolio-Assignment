"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SubTopic } from "@/types/sheet";
import { cn } from "@/lib/utils";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useSheetStore } from "@/store/sheet-store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { QuestionList } from "./QuestionList";

interface SortableSubTopicItemProps {
  topicId: string;
  subTopic: SubTopic;
}

export function SortableSubTopicItem({ topicId, subTopic }: SortableSubTopicItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(subTopic.title);
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQLink, setNewQLinkUrl] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subTopic.id });

  const { updateSubTopic, deleteSubTopic, addQuestion } = useSheetStore();

  const style = isDragging
    ? { transition }
    : { transform: CSS.Transform.toString(transform), transition };

  function handleSaveSubTopic() {
    const t = title.trim();
    if (t) {
      updateSubTopic(topicId, subTopic.id, t);
      setEditing(false);
    }
  }

  function handleAddQuestion() {
    const t = newQTitle.trim();
    if (t) {
      addQuestion(topicId, subTopic.id, t, newQLink.trim() || undefined);
      setNewQTitle("");
      setNewQLinkUrl("");
      setShowAddQ(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative w-full",
        isDragging && "h-0 min-h-0 overflow-hidden !m-0 border-0 p-0"
      )}
    >
      <div
        className={cn(
          "rounded-md border border-ink-200 bg-white/70 shadow-sm dark:border-ink-600 dark:bg-ink-700/40",
          isDragging && "opacity-0 pointer-events-none"
        )}
      >
      <div className="flex items-center gap-2 border-b border-ink-200 px-3 py-2 dark:border-ink-600">
        <button
          className="touch-none cursor-grab active:cursor-grabbing rounded p-0.5 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder sub-topic"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveSubTopic()}
              className="flex-1 rounded border border-ink-200 bg-white px-2 py-1 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
              aria-label="Sub-topic title"
              placeholder="Sub-topic title"
              autoFocus
            />
            <button
              onClick={handleSaveSubTopic}
              className="text-xs font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="flex-1 text-sm font-medium text-ink-700 dark:text-ink-200">
              {subTopic.title}
            </h3>
            <button
              onClick={() => setEditing(true)}
              className="rounded p-1 text-ink-400 hover:bg-ink-200 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-600 dark:hover:text-ink-300"
              aria-label="Edit sub-topic"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowAddQ(true)}
              className="rounded p-1 text-ink-400 hover:bg-ink-200 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-600 dark:hover:text-ink-300"
              aria-label="Add question"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded p-1 text-ink-400 hover:bg-red-100 hover:text-red-600 dark:text-ink-500 dark:hover:bg-red-900/40 dark:hover:text-red-400"
              aria-label="Delete sub-topic"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {showAddQ && (
        <div className="flex flex-col gap-2 border-b border-ink-200 bg-ink-50/80 px-3 py-2 dark:border-ink-600 dark:bg-ink-800/50">
          <input
            type="text"
            placeholder="Question title"
            value={newQTitle}
            onChange={(e) => setNewQTitle(e.target.value)}
            className="rounded border border-ink-200 bg-white px-2 py-1 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
            aria-label="New question title"
          />
          <input
            type="url"
            placeholder="Link (optional)"
            value={newQLink}
            onChange={(e) => setNewQLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
            className="rounded border border-ink-200 bg-white px-2 py-1 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
            aria-label="Question link URL"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddQuestion}
              className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              Add question
            </button>
            <button
              onClick={() => {
                setShowAddQ(false);
                setNewQTitle("");
                setNewQLinkUrl("");
              }}
              className="text-sm text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="px-3 py-2">
        <QuestionList
          topicId={topicId}
          subTopicId={subTopic.id}
          questions={subTopic.questions}
        />
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete sub-topic?"
        message={`Delete "${subTopic.title}" and all its questions? This cannot be undone.`}
        confirmLabel="Delete sub-topic"
        onConfirm={() => deleteSubTopic(topicId, subTopic.id)}
      />
      </div>
    </div>
  );
}
