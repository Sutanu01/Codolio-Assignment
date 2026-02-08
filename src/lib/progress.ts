import type { Sheet } from "@/types/sheet";

export function getSheetProgress(sheet: Sheet | null): { done: number; total: number; percent: number } {
  if (!sheet) return { done: 0, total: 0, percent: 0 };
  let total = 0;
  let done = 0;
  for (const topic of sheet.topics) {
    for (const sub of topic.subTopics) {
      for (const q of sub.questions) {
        total += 1;
        if (q.status === "done") done += 1;
      }
    }
  }
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, percent };
}
