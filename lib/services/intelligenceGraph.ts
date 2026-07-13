import type { Article } from "@/app/types/article";
import type {
  GraphConnection,
  GraphNode,
  IntelligenceGraph,
} from "@/app/types/intelligenceGraph";

type IntelligenceGraphApiResponse = {
  centralStory?: unknown;
  nodes?: unknown;
  connections?: unknown;
};

function isGraphNode(value: unknown): value is GraphNode {
  if (!value || typeof value !== "object") {
    return false;
  }

  const node = value as Record<string, unknown>;

  return (
    typeof node.id === "string" &&
    typeof node.type === "string" &&
    typeof node.title === "string" &&
    typeof node.description === "string"
  );
}

function isGraphConnection(
  value: unknown
): value is GraphConnection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const connection = value as Record<string, unknown>;

  return (
    typeof connection.from === "string" &&
    typeof connection.to === "string" &&
    typeof connection.relationship === "string"
  );
}

export async function generateIntelligenceGraph(
  article: Article
): Promise<IntelligenceGraph> {
  const response = await fetch("/api/intelligence-graph", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    throw new Error("Failed to generate Intelligence Graph");
  }

  const data =
    (await response.json()) as IntelligenceGraphApiResponse;

  const nodes = Array.isArray(data.nodes)
    ? data.nodes.filter(isGraphNode)
    : [];

  const connections = Array.isArray(data.connections)
    ? data.connections.filter(isGraphConnection)
    : [];

  return {
    centralStory:
      typeof data.centralStory === "string"
        ? data.centralStory
        : article.title,

    nodes,

    connections,
  };
}