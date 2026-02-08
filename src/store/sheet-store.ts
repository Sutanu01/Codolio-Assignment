import { create } from "zustand";
import type { Sheet, Topic, SubTopic, Question, QuestionStatus } from "@/types/sheet";

interface SheetState {
  sheet: Sheet | null;
  setSheet: (sheet: Sheet | null) => void;

  // Topics
  addTopic: (title: string) => void;
  updateTopic: (id: string, title: string) => void;
  deleteTopic: (id: string) => void;
  reorderTopics: (fromIndex: number, toIndex: number) => void;

  // Sub-topics
  addSubTopic: (topicId: string, title: string) => void;
  updateSubTopic: (topicId: string, subTopicId: string, title: string) => void;
  deleteSubTopic: (topicId: string, subTopicId: string) => void;
  reorderSubTopics: (topicId: string, fromIndex: number, toIndex: number) => void;

  // Questions
  addQuestion: (
    topicId: string,
    subTopicId: string | null,
    title: string,
    link?: string
  ) => void;
  updateQuestion: (
    topicId: string,
    subTopicId: string | null,
    questionId: string,
    payload: { title?: string; link?: string; status?: QuestionStatus; tags?: string[] }
  ) => void;
  setQuestionStatus: (
    topicId: string,
    subTopicId: string,
    questionId: string,
    status: QuestionStatus
  ) => void;
  addQuestionTag: (
    topicId: string,
    subTopicId: string,
    questionId: string,
    tag: string
  ) => void;
  removeQuestionTag: (
    topicId: string,
    subTopicId: string,
    questionId: string,
    tag: string
  ) => void;
  deleteQuestion: (
    topicId: string,
    subTopicId: string | null,
    questionId: string
  ) => void;
  reorderQuestions: (
    topicId: string,
    subTopicId: string | null,
    fromIndex: number,
    toIndex: number
  ) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useSheetStore = create<SheetState>((set) => ({
  sheet: null,
  setSheet: (sheet) => set({ sheet }),

  addTopic: (title) =>
    set((state) => {
      if (!state.sheet) return state;
      const newTopic: Topic = {
        id: generateId(),
        title,
        order: state.sheet.topics.length,
        subTopics: [],
      };
      return {
        sheet: {
          ...state.sheet,
          topics: [...state.sheet.topics, newTopic],
        },
      };
    }),

  updateTopic: (id, title) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) =>
            t.id === id ? { ...t, title } : t
          ),
        },
      };
    }),

  deleteTopic: (id) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.filter((t) => t.id !== id),
        },
      };
    }),

  reorderTopics: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.sheet) return state;
      const topics = [...state.sheet.topics];
      const [removed] = topics.splice(fromIndex, 1);
      topics.splice(toIndex, 0, removed);
      topics.forEach((t, i) => (t.order = i));
      return { sheet: { ...state.sheet, topics } };
    }),

  addSubTopic: (topicId, title) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            const newSub: SubTopic = {
              id: generateId(),
              title,
              order: t.subTopics.length,
              topicId,
              questions: [],
            };
            return {
              ...t,
              subTopics: [...t.subTopics, newSub],
            };
          }),
        },
      };
    }),

  updateSubTopic: (topicId, subTopicId, title) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) =>
                s.id === subTopicId ? { ...s, title } : s
              ),
            };
          }),
        },
      };
    }),

  deleteSubTopic: (topicId, subTopicId) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.filter((s) => s.id !== subTopicId),
            };
          }),
        },
      };
    }),

  reorderSubTopics: (topicId, fromIndex, toIndex) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            const subTopics = [...t.subTopics];
            const [removed] = subTopics.splice(fromIndex, 1);
            subTopics.splice(toIndex, 0, removed);
            subTopics.forEach((s, i) => (s.order = i));
            return { ...t, subTopics };
          }),
        },
      };
    }),

  addQuestion: (topicId, subTopicId, title, link) =>
    set((state) => {
      if (!state.sheet) return state;
      const newQ: Question = {
        id: generateId(),
        title,
        link,
        order: 0,
        topicId,
        subTopicId,
        status: "todo",
        tags: [],
      };
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            if (subTopicId) {
              const sub = t.subTopics.find((s) => s.id === subTopicId);
              if (!sub) return t;
              newQ.order = sub.questions.length;
              return {
                ...t,
                subTopics: t.subTopics.map((s) =>
                  s.id === subTopicId
                    ? { ...s, questions: [...s.questions, newQ] }
                    : s
                ),
              };
            }
            const topLevel = t.subTopics.flatMap((s) => s.questions).length;
            newQ.order = topLevel;
            return {
              ...t,
              subTopics: [
                ...t.subTopics,
                {
                  id: generateId(),
                  title: "Uncategorized",
                  order: t.subTopics.length,
                  topicId,
                  questions: [newQ],
                },
              ],
            };
          }),
        },
      };
    }),

  updateQuestion: (topicId, subTopicId, questionId, payload) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => {
                const belongs =
                  (subTopicId && s.id === subTopicId) ||
                  (!subTopicId && s.questions.some((q) => q.id === questionId));
                if (!belongs) return s;
                return {
                  ...s,
                  questions: s.questions.map((q) =>
                    q.id === questionId ? { ...q, ...payload } : q
                  ),
                };
              }),
            };
          }),
        },
      };
    }),

  setQuestionStatus: (topicId, subTopicId, questionId, status) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => {
                if (s.id !== subTopicId) return s;
                return {
                  ...s,
                  questions: s.questions.map((q) =>
                    q.id === questionId ? { ...q, status } : q
                  ),
                };
              }),
            };
          }),
        },
      };
    }),

  addQuestionTag: (topicId, subTopicId, questionId, tag) =>
    set((state) => {
      if (!state.sheet) return state;
      const trimmed = tag.trim().toLowerCase();
      if (!trimmed) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => {
                if (s.id !== subTopicId) return s;
                return {
                  ...s,
                  questions: s.questions.map((q) => {
                    if (q.id !== questionId) return q;
                    const tags = q.tags ?? [];
                    if (tags.includes(trimmed)) return q;
                    return { ...q, tags: [...tags, trimmed] };
                  }),
                };
              }),
            };
          }),
        },
      };
    }),

  removeQuestionTag: (topicId, subTopicId, questionId, tagToRemove) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => {
                if (s.id !== subTopicId) return s;
                return {
                  ...s,
                  questions: s.questions.map((q) =>
                    q.id === questionId
                      ? { ...q, tags: (q.tags ?? []).filter((t) => t !== tagToRemove) }
                      : q
                  ),
                };
              }),
            };
          }),
        },
      };
    }),

  deleteQuestion: (topicId, subTopicId, questionId) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => ({
                ...s,
                questions: s.questions.filter((q) => q.id !== questionId),
              })),
            };
          }),
        },
      };
    }),

  reorderQuestions: (topicId, subTopicId, fromIndex, toIndex) =>
    set((state) => {
      if (!state.sheet) return state;
      return {
        sheet: {
          ...state.sheet,
          topics: state.sheet.topics.map((t) => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subTopics: t.subTopics.map((s) => {
                const isTarget =
                  (subTopicId && s.id === subTopicId) || !subTopicId;
                if (!isTarget) return s;
                const questions = [...s.questions];
                const [removed] = questions.splice(fromIndex, 1);
                questions.splice(toIndex, 0, removed);
                questions.forEach((q, i) => (q.order = i));
                return { ...s, questions };
              }),
            };
          }),
        },
      };
    }),
}));
