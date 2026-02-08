"use client";

import { useEffect, useState } from "react";
import { useSheetStore } from "@/store/sheet-store";
import { SortableTopicList } from "./SortableTopicList";
import { getSheetProgress } from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { sampleSheet } from "@/data/sample-sheet";
import { Moon, Plus, Sun } from "lucide-react";

export function SheetView() {
  const { sheet, setSheet, addTopic } = useSheetStore();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const progress = getSheetProgress(sheet);

  useEffect(() => {
    fetch("/api/sheet")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = (data && typeof data.error === "string") ? data.error : "Failed to load sheet";
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        setSheet(data);
      })
      .catch((e) => {
        setSheet(JSON.parse(JSON.stringify(sampleSheet)));
        setError(null);
      })
      .finally(() => setLoading(false));
  }, [setSheet]);

  function handleAddTopic() {
    const t = newTopicTitle.trim();
    if (t) {
      addTopic(t);
      setNewTopicTitle("");
      setShowAddTopic(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-ink-500 dark:text-ink-400">Loading sheet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="py-8 text-ink-500 dark:text-ink-400">No sheet data.</div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {sheet.title}
            </h1>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Mark questions done, add tags, and drag to reorder.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-amber-50/80 text-ink-600 hover:bg-amber-100/80 dark:border-ink-600 dark:bg-ink-800 dark:text-amber-400 dark:hover:bg-ink-700"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {showAddTopic ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="New topic name"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                  className="min-w-[160px] rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-100 dark:placeholder:text-ink-500"
                  aria-label="New topic name"
                  autoFocus
                />
                <button
                  onClick={handleAddTopic}
                  className="rounded-md bg-ink-800 px-3 py-2 text-sm font-medium text-white hover:bg-ink-900 dark:bg-ink-200 dark:text-ink-900 dark:hover:bg-ink-100"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddTopic(false);
                    setNewTopicTitle("");
                  }}
                  className="text-sm text-ink-500 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTopic(true)}
                className="inline-flex h-[42px] items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-400"
              >
                <Plus className="h-4 w-4" />
                Add topic
              </button>
            )}
          </div>
        </div>

        {progress.total > 0 && (
          <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 dark:border-ink-600 dark:bg-ink-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-600 dark:text-ink-400">
                {progress.done} of {progress.total} done
              </span>
              <span className="font-medium text-ink-800 dark:text-ink-200">
                {progress.percent}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-200/80 dark:bg-ink-700">
              <div
                className="progress-fill h-full rounded-full bg-accent-500 dark:bg-accent-400"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <SortableTopicList />
    </div>
  );
}
