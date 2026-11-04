export type Level = "beginner" | "intermediate" | "advanced";

export type DiagramNode = { label: string; sub?: string };
export type Diagram = {
  title: string;
  nodes: DiagramNode[];
  note?: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Lesson = {
  id: string;
  level: Level;
  order: number;
  title: string;
  titleEn: string;
  summary: string;
  minutes: number;
  labModule?: string;
  objectives: string[];
  definition: string;
  principle: string[];
  why: string[];
  how: string[];
  tools: { name: string; desc: string }[];
  realWorld: string[];
  example: { caption: string; code: string };
  diagram: Diagram;
  mistakes: { wrong: string; why: string }[];
  quiz: QuizQuestion[];
  readings: { title: string; note: string }[];
};

export type GlossaryTerm = {
  en: string;
  tr: string;
  group: string;
  def: string;
};
