/**
 https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet
 */

import type { Sheet } from "@/types/sheet";

export const sampleSheet: Sheet = {
  id: "sheet-1",
  title: "DSA Practice Sheet",
  slug: "dsa-practice-sheet",
  topics: [
    {
      id: "topic-1",
      title: "Arrays",
      order: 0,
      subTopics: [
        {
          id: "st-1",
          title: "Easy",
          order: 0,
          topicId: "topic-1",
          questions: [
            {
              id: "q-1",
              title: "Two Sum",
              link: "https://leetcode.com/problems/two-sum/",
              order: 0,
              topicId: "topic-1",
              subTopicId: "st-1",
              status: "done",
              tags: ["hash map", "easy"],
            },
            {
              id: "q-2",
              title: "Best Time to Buy and Sell Stock",
              link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
              order: 1,
              topicId: "topic-1",
              subTopicId: "st-1",
              status: "in_progress",
              tags: ["sliding window"],
            },
          ],
        },
        {
          id: "st-2",
          title: "Medium",
          order: 1,
          topicId: "topic-1",
          questions: [
            {
              id: "q-3",
              title: "3Sum",
              link: "https://leetcode.com/problems/3sum/",
              order: 0,
              topicId: "topic-1",
              subTopicId: "st-2",
              status: "todo",
              tags: ["two pointers", "medium"],
            },
          ],
        },
      ],
    },
    {
      id: "topic-2",
      title: "Linked List",
      order: 1,
      subTopics: [
        {
          id: "st-3",
          title: "Basics",
          order: 0,
          topicId: "topic-2",
          questions: [
            {
              id: "q-4",
              title: "Reverse Linked List",
              link: "https://leetcode.com/problems/reverse-linked-list/",
              order: 0,
              topicId: "topic-2",
              subTopicId: "st-3",
              status: "todo",
              tags: ["recursion", "pointers"],
            },
          ],
        },
      ],
    },
  ],
};
