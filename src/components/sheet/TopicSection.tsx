"use client";

import type { Topic } from "@/types/sheet";
import { SortableTopicItem } from "./SortableTopicItem";

interface TopicSectionProps {
  topic: Topic;
  index: number;
}

export function TopicSection({ topic, index }: TopicSectionProps) {
  return <SortableTopicItem topic={topic} index={index} />;
}
