"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question, QuestionStatus } from "@/types/sheet";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, GripVertical, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useSheetStore } from "@/store/sheet-store";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface SortableQuestionItemProps {
  topicId: string;
  subTopicId: string;
  question: Question;
}

const STATUS_ORDER: QuestionStatus[] = ["todo", "in_progress", "done"];
const STATUS_LABEL: Record<QuestionStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function nextStatus(current: QuestionStatus): QuestionStatus {
  const i = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

export function SortableQuestionItem({
  topicId,
  subTopicId,
  question,
}: SortableQuestionItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(question.title);
  const [link, setLink] = useState(question.link ?? "");
  const [newTag, setNewTag] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const {
    updateQuestion,
    deleteQuestion,
    setQuestionStatus,
    addQuestionTag,
    removeQuestionTag,
  } = useSheetStore();

  const status = question.status ?? "todo";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleSave() {
    const t = title.trim();
    if (t) {
      updateQuestion(topicId, subTopicId, question.id, {
        title: t,
        link: link.trim() || undefined,
      });
      setEditing(false);
    }
  }

  function handleStatusClick() {
    setQuestionStatus(topicId, subTopicId, question.id, nextStatus(status));
  }

  function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    const t = newTag.trim();
    if (t) {
      addQuestionTag(topicId, subTopicId, question.id, t);
      setNewTag("");
    }
  }

  const tags = question.tags ?? [];

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-wrap items-center gap-2 rounded-md border border-transparent py-1.5 px-2 transition-colors",
        "hover:border-ink-200 hover:bg-white dark:hover:border-ink-600 dark:hover:bg-ink-700/50",
        status === "done" && "opacity-75",
        isDragging && "z-30 bg-white opacity-90 shadow-card dark:bg-ink-700"
      )}
    >
      <button
        className="touch-none shrink-0 cursor-grab active:cursor-grabbing rounded p-0.5 text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder question"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleStatusClick}
        className={cn(
          "shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium transition-colors",
          status === "todo" &&
            "border-ink-200 bg-white text-ink-500 hover:border-ink-300 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-400",
          status === "in_progress" &&
            "border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-600 dark:bg-accent-900/40 dark:text-accent-300",
          status === "done" &&
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        )}
        title={`Status: ${STATUS_LABEL[status]}. Click to change.`}
      >
        {status === "done" ? (
          <Check className="h-3 w-3" />
        ) : (
          STATUS_LABEL[status]
        )}
      </button>

      {editing ? (
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full rounded border border-ink-200 bg-white px-2 py-1 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
            aria-label="Question title"
            placeholder="Question title"
            autoFocus
          />
          <input
            type="url"
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded border border-ink-200 bg-white px-2 py-1 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
            aria-label="Question link URL"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-xs font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              Save
            </button>
            <button
              onClick={() => {
                setTitle(question.title);
                setLink(question.link ?? "");
                setEditing(false);
              }}
              className="text-xs text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm text-ink-700 dark:text-ink-200",
              status === "done" &&
                "line-through decoration-ink-300 dark:decoration-ink-500"
            )}
          >
            {question.title}
          </span>
          {tags.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded bg-ink-100 px-1.5 py-0.5 text-xs text-ink-600 dark:bg-ink-600 dark:text-ink-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      removeQuestionTag(topicId, subTopicId, question.id, tag)
                    }
                    className="rounded hover:bg-ink-200 dark:hover:bg-ink-500"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </span>
          )}
          <form onSubmit={handleAddTag} className="flex shrink-0 items-center gap-1">
            <input
              type="text"
              placeholder="+ tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-16 rounded border-0 bg-transparent px-1 py-0.5 text-xs text-ink-400 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-ink-300 dark:text-ink-500 dark:placeholder:text-ink-500"
              aria-label="Add tag"
            />
          </form>
          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-accent-600 dark:hover:bg-ink-600 dark:hover:text-accent-400"
              aria-label="Open link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:hover:bg-ink-600 dark:hover:text-ink-300"
            aria-label="Edit question"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="shrink-0 rounded p-0.5 text-ink-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-400"
            aria-label="Delete question"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete question?"
        message={`Delete "${question.title}"? This cannot be undone.`}
        confirmLabel="Delete question"
        onConfirm={() => deleteQuestion(topicId, subTopicId, question.id)}
      />
    </li>
  );
}
