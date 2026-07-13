export type GraphNodeType =
  | "Story"
  | "Person"
  | "Organization"
  | "Legislation"
  | "Court Case"
  | "Government Agency"
  | "Location"
  | "Topic"
  | "Historical Event";

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  title: string;
  description: string;
};

export type GraphConnection = {
  from: string;
  to: string;
  relationship: string;
};

export type IntelligenceGraph = {
  centralStory: string;

  nodes: GraphNode[];

  connections: GraphConnection[];
};