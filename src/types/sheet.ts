
export type QuestionStatus = "todo" | "in_progress" | "done";

export interface Question {
  id: string;
  title: string;
  link?: string;
  order: number;
  topicId: string;
  subTopicId: string | null;
  status?: QuestionStatus;
  tags?: string[];
}

export interface SubTopic {
  id: string;
  title: string;
  order: number;
  topicId: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  order: number;
  subTopics: SubTopic[];
}

export interface Sheet {
  id: string;
  title: string;
  slug?: string;
  topics: Topic[];
}
