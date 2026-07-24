import type {
  GraphConnection,
  GraphNode,
  IntelligenceGraph as IntelligenceGraphData,
} from "@/app/types/intelligenceGraph";

import AnalysisCard from "@/app/components/ui/AnalysisCard";
import SectionHeader from "@/app/components/ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type IntelligenceGraphProps = {
  graph: IntelligenceGraphData;
};

type NodeTone =
  | "primary"
  | "info"
  | "success"
  | "warning";

type NodePresentation = {
  accent: NodeTone;
  color: string;
};

const nodePresentations: Record<
  GraphNode["type"],
  NodePresentation
> = {
  Story: {
    accent: "primary",
    color: colors.brand.primary,
  },
  Person: {
    accent: "info",
    color: colors.status.info,
  },
  Organization: {
    accent: "info",
    color: colors.status.info,
  },
  Legislation: {
    accent: "success",
    color: colors.status.success,
  },
  "Court Case": {
    accent: "warning",
    color: colors.status.warning,
  },
  "Government Agency": {
    accent: "info",
    color: colors.status.info,
  },
  Location: {
    accent: "success",
    color: colors.status.success,
  },
  Topic: {
    accent: "primary",
    color: colors.brand.primary,
  },
  "Historical Event": {
    accent: "warning",
    color: colors.status.warning,
  },
};

function getNodeTitle(
  nodeId: string,
  nodes: GraphNode[]
): string {
  return (
    nodes.find((node) => node.id === nodeId)?.title ??
    nodeId
  );
}

function getConnectionsForNode(
  nodeId: string,
  connections: GraphConnection[]
): GraphConnection[] {
  return connections.filter(
    (connection) =>
      connection.from === nodeId ||
      connection.to === nodeId
  );
}

function getConnectedNodeId(
  nodeId: string,
  connection: GraphConnection
): string {
  return connection.from === nodeId
    ? connection.to
    : connection.from;
}

export default function IntelligenceGraph({
  graph,
}: IntelligenceGraphProps) {
  const centralNode =
    graph.nodes.find(
      (node) => node.id === "story-1"
    ) ??
    graph.nodes.find(
      (node) => node.type === "Story"
    );

  const relatedNodes = graph.nodes.filter(
    (node) => node.id !== centralNode?.id
  );

  const totalConnections =
    graph.connections.length;

  return (
    <section
      aria-labelledby="intelligence-graph-title"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
      style={{
        backgroundColor: colors.background.surface,
        borderColor: colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor: `${colors.status.info}12`,
        }}
      />

      <div className="relative">
        <SectionHeader
          eyebrow="Intelligence Graph"
          title="Connected Context"
          subtitle="Explore the people, organizations, legislation, topics, and events connected to this story."
        />

        {centralNode ? (
          <div className="mt-8">
            <article
              className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border p-6 text-center sm:p-8"
              style={{
                backgroundColor:
                  colors.background.elevated,
                borderColor: `${colors.brand.primary}55`,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  backgroundColor:
                    colors.brand.primary,
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
                style={{
                  backgroundColor: `${colors.brand.primary}16`,
                }}
              />

              <div className="relative">
                <div
                  className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2"
                  style={{
                    backgroundColor: `${colors.brand.primary}12`,
                    borderColor: `${colors.brand.primary}35`,
                    color: colors.brand.primary,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-current"
                  />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Central Story
                  </span>
                </div>

                <h3
                  id="intelligence-graph-title"
                  className="mx-auto mt-5 max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  {centralNode.title}
                </h3>

                <p
                  className="mx-auto mt-4 max-w-3xl text-sm leading-7 sm:text-base sm:leading-8"
                  style={{
                    color: colors.text.secondary,
                  }}
                >
                  {centralNode.description}
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <div
                    className="rounded-xl border px-4 py-3"
                    style={{
                      backgroundColor:
                        colors.background.surface,
                      borderColor:
                        colors.border.default,
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{
                        color: colors.text.muted,
                      }}
                    >
                      Related Entities
                    </p>

                    <p
                      className="mt-1 text-xl font-bold"
                      style={{
                        color: colors.text.primary,
                      }}
                    >
                      {relatedNodes.length}
                    </p>
                  </div>

                  <div
                    className="rounded-xl border px-4 py-3"
                    style={{
                      backgroundColor:
                        colors.background.surface,
                      borderColor:
                        colors.border.default,
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{
                        color: colors.text.muted,
                      }}
                    >
                      Connections
                    </p>

                    <p
                      className="mt-1 text-xl font-bold"
                      style={{
                        color: colors.text.primary,
                      }}
                    >
                      {totalConnections}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {relatedNodes.length > 0 ? (
              <>
                <div
                  aria-hidden="true"
                  className="mx-auto h-12 w-px"
                  style={{
                    backgroundColor:
                      colors.border.strong ??
                      colors.border.default,
                  }}
                />

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {relatedNodes.map((node) => {
                    const connections =
                      getConnectionsForNode(
                        node.id,
                        graph.connections
                      );

                    const presentation =
                      nodePresentations[node.type];

                    return (
                      <AnalysisCard
                        key={node.id}
                        eyebrow={node.type}
                        title={node.title}
                        accent={presentation.accent}
                        className="h-full"
                      >
                        <p
                          className="text-sm leading-7 sm:text-base"
                          style={{
                            color:
                              colors.text.secondary,
                          }}
                        >
                          {node.description}
                        </p>

                        {connections.length > 0 ? (
                          <div
                            className="mt-6 border-t pt-5"
                            style={{
                              borderColor:
                                colors.border.default,
                            }}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p
                                className="text-xs font-semibold uppercase tracking-[0.18em]"
                                style={{
                                  color:
                                    colors.text.muted,
                                }}
                              >
                                Connections
                              </p>

                              <span
                                className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: `${presentation.color}10`,
                                  borderColor: `${presentation.color}30`,
                                  color:
                                    presentation.color,
                                }}
                              >
                                {connections.length}
                              </span>
                            </div>

                            <ul
                              aria-label={`Connections for ${node.title}`}
                              className="mt-4 space-y-4"
                            >
                              {connections.map(
                                (
                                  connection,
                                  index
                                ) => {
                                  const connectedNodeId =
                                    getConnectedNodeId(
                                      node.id,
                                      connection
                                    );

                                  return (
                                    <li
                                      key={`${connection.from}-${connection.to}-${index}`}
                                      className="relative pl-4"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full"
                                        style={{
                                          backgroundColor:
                                            presentation.color,
                                        }}
                                      />

                                      <p
                                        className="text-sm leading-6"
                                        style={{
                                          color:
                                            colors.text
                                              .secondary,
                                        }}
                                      >
                                        <span
                                          className="font-semibold"
                                          style={{
                                            color:
                                              colors.text
                                                .primary,
                                          }}
                                        >
                                          {getNodeTitle(
                                            connectedNodeId,
                                            graph.nodes
                                          )}
                                        </span>

                                        <span
                                          aria-hidden="true"
                                          style={{
                                            color:
                                              colors.text
                                                .muted,
                                          }}
                                        >
                                          {" "}
                                          —{" "}
                                        </span>

                                        {
                                          connection.relationship
                                        }
                                      </p>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        ) : (
                          <p
                            className="mt-6 border-t pt-5 text-sm leading-6"
                            style={{
                              borderColor:
                                colors.border.default,
                              color: colors.text.muted,
                            }}
                          >
                            No additional relationships
                            were identified for this
                            entity.
                          </p>
                        )}
                      </AnalysisCard>
                    );
                  })}
                </div>
              </>
            ) : (
              <div
                role="status"
                className="mt-6 rounded-2xl border border-dashed p-6"
                style={{
                  backgroundColor:
                    colors.background.elevated,
                  borderColor:
                    colors.border.default,
                }}
              >
                <p
                  className="text-sm leading-6"
                  style={{
                    color: colors.text.muted,
                  }}
                >
                  No related entities were identified
                  for this story.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-dashed p-6 sm:p-8"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor: colors.border.default,
            }}
          >
            <p
              className="text-sm leading-7 sm:text-base"
              style={{
                color: colors.text.muted,
              }}
            >
              PoliticalPulse could not generate connected
              story context from the available article
              information.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}