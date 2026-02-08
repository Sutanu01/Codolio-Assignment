"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Topic } from "@/types/sheet";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSheetStore } from "@/store/sheet-store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SubTopicList } from "./SubTopicList";

interface SortableTopicItemProps {
  topic: Topic;
  index: number;
}

const LIGHT_CARD_TINTS = [
  "bg-tint-amber border-amber-200/60",
  "bg-tint-sky border-sky-200/60",
  "bg-tint-emerald border-emerald-200/60",
  "bg-tint-violet border-violet-200/60",
  "bg-tint-rose border-rose-200/60",
] as const;

function countQuestions(topic: Topic): number {
  return topic.subTopics.reduce((sum, s) => sum + s.questions.length, 0);
}

export function SortableTopicItem({ topic, index }: SortableTopicItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(topic.title);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSubTitle, setNewSubTitle] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const { updateTopic, deleteTopic, addSubTopic } = useSheetStore();
  const questionCount = countQuestions(topic);
  const tintClass = LIGHT_CARD_TINTS[index % LIGHT_CARD_TINTS.length];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleSaveTopic() {
    const t = title.trim();
    if (t) {
      updateTopic(topic.id, t);
      setEditing(false);
    }
  }

  function handleAddSubTopic() {
    const t = newSubTitle.trim();
    if (t) {
      addSubTopic(topic.id, t);
      setNewSubTitle("");
      setShowAddSub(false);
    }
  }

  return (
    <div
      className={cn(
        "relative transition-[height] duration-150",
        isDragging && "h-0 min-h-0"
      )}
    >
      <div
        ref={setNodeRef}
        style={{
          ...style,
          ...(isDragging ? { position: "absolute" as const, left: 0, top: 0, width: "100%" } : {}),
        }}
        className={cn(
          "rounded-lg border shadow-card transition-shadow dark:border-ink-600 dark:bg-ink-800",
          tintClass,
          isDragging && "opacity-85 shadow-cardHover z-50"
        )}
      >
      <div className="flex items-center gap-2 border-b border-ink-100 px-4 py-3 dark:border-ink-600">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-700 dark:hover:text-ink-300"
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        <button
          className="touch-none cursor-grab active:cursor-grabbing rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-700 dark:hover:text-ink-300"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder topic"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTopic()}
              className="flex-1 rounded border border-ink-200 bg-white px-2.5 py-1.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
              aria-label="Topic title"
              placeholder="Topic title"
              autoFocus
            />
            <button
              onClick={handleSaveTopic}
              className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h2 className="min-w-0 flex-1 truncate font-medium text-ink-800 dark:text-ink-100">
              {topic.title}
            </h2>
            {questionCount > 0 && (
              <span className="shrink-0 rounded bg-ink-200/80 px-1.5 py-0.5 text-xs text-ink-600 dark:bg-ink-600 dark:text-ink-300">
                {questionCount}
              </span>
            )}
            <button
              onClick={() => setEditing(true)}
              className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-700 dark:hover:text-ink-300"
              aria-label="Edit topic"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowAddSub(true)}
              className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600 dark:text-ink-500 dark:hover:bg-ink-700 dark:hover:text-ink-300"
              aria-label="Add sub-topic"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded p-1.5 text-ink-400 hover:bg-red-100 hover:text-red-600 dark:text-ink-500 dark:hover:bg-red-900/40 dark:hover:text-red-400"
              aria-label="Delete topic"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {showAddSub && (
        <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-2 dark:border-ink-600 dark:bg-ink-700/50">
          <input
            type="text"
            placeholder="Sub-topic title"
            value={newSubTitle}
            onChange={(e) => setNewSubTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubTopic()}
            className="flex-1 rounded border border-ink-200 bg-white px-2.5 py-1.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-100"
            aria-label="New sub-topic title"
            autoFocus
          />
          <button
            onClick={handleAddSubTopic}
            className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddSub(false);
              setNewSubTitle("");
            }}
            className="text-sm text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-300"
          >
            Cancel
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="p-4 pt-2">
          <SubTopicList topicId={topic.id} subTopics={topic.subTopics} />
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete topic?"
        message={`Delete "${topic.title}" and all its sub-topics and questions? This cannot be undone.`}
        confirmLabel="Delete topic"
        onConfirm={() => deleteTopic(topic.id)}
      />
      </div>
    </div>
  );
}
