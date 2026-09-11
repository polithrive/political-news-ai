import type {
  GraphConnection,
  GraphNode,
  IntelligenceGraph as IntelligenceGraphData,
} from "@/app/types/intelligenceGraph";

type IntelligenceGraphProps = {
  graph: IntelligenceGraphData;
};

type NodeTone =
  | "cyan"
  | "blue"
  | "green"
  | "amber"
  | "red";

type NodePresentation = {
  label: string;
  border: string;
  background: string;
  text: string;
  dot: string;
};

const nodePresentations: Record<
  GraphNode["type"],
  NodePresentation
> = {
  Story: {
    label: "Story",
    border: "border-[#38BDF8]/25",
    background: "bg-[#38BDF8]/[0.06]",
    text: "text-[#7DD3FC]",
    dot: "bg-[#38BDF8]",
  },

  Person: {
    label: "Person",
    border: "border-blue-400/20",
    background: "bg-blue-500/[0.05]",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },

  Organization: {
    label: "Organization",
    border: "border-blue-400/20",
    background: "bg-blue-500/[0.05]",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },

  Legislation: {
    label: "Legislation",
    border: "border-emerald-500/20",
    background: "bg-emerald-500/[0.05]",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },

  "Court Case": {
    label: "Court Case",
    border: "border-amber-500/20",
    background: "bg-amber-500/[0.05]",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },

  "Government Agency": {
    label: "Government Agency",
    border: "border-blue-400/20",
    background: "bg-blue-500/[0.05]",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },

  Location: {
    label: "Location",
    border: "border-emerald-500/20",
    background: "bg-emerald-500/[0.05]",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },

  Topic: {
    label: "Topic",
    border: "border-[#FF2638]/20",
    background: "bg-[#FF2638]/[0.05]",
    text: "text-[#FF8B95]",
    dot: "bg-[#FF5161]",
  },

  "Historical Event": {
    label: "Historical Event",
    border: "border-amber-500/20",
    background: "bg-amber-500/[0.05]",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
};

function getNodeTitle(
  nodeId: string,
  nodes: GraphNode[]
): string {
  return (
    nodes.find(
      (node) => node.id === nodeId
    )?.title ?? nodeId
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

  const relatedNodes =
    graph.nodes.filter(
      (node) =>
        node.id !== centralNode?.id
    );

  const totalConnections =
    graph.connections.length;

  return (
    <section
      aria-labelledby="intelligence-graph-title"
      className="relative overflow-hidden rounded-3xl border border-[#17446D]/70 bg-[#04162C]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#38BDF8]/5 blur-3xl"
      />

      <div className="relative">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#55C8FF]">
            Intelligence Graph
          </p>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
            Connected context
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8EA3B7]">
            Explore the people,
            organizations, legislation,
            topics, places, and events
            connected to this story.
          </p>
        </div>

        {centralNode ? (
          <div className="mt-8">
            <article className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-[#020D21]/70 p-6 text-center sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-[#38BDF8]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#38BDF8]/10 blur-3xl"
              />

              <div className="relative">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-4 py-2 text-[#7DD3FC]">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-[#38BDF8]"
                  />

                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Central Story
                  </span>
                </div>

                <h3
                  id="intelligence-graph-title"
                  className="mx-auto mt-5 max-w-3xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                >
                  {centralNode.title}
                </h3>

                <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#B5C3D2] sm:text-base sm:leading-8">
                  {centralNode.description}
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <div className="min-w-[130px] rounded-xl border border-[#17446D]/60 bg-[#061A31] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6F879F]">
                      Related Entities
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {relatedNodes.length}
                    </p>
                  </div>

                  <div className="min-w-[130px] rounded-xl border border-[#17446D]/60 bg-[#061A31] px-4 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6F879F]">
                      Connections
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
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
                  className="mx-auto h-12 w-px bg-[#17446D]"
                />

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {relatedNodes.map(
                    (node) => {
                      const connections =
                        getConnectionsForNode(
                          node.id,
                          graph.connections
                        );

                      const presentation =
                        nodePresentations[
                          node.type
                        ];

                      return (
                        <article
                          key={node.id}
                          className={`h-full overflow-hidden rounded-2xl border ${presentation.border} ${presentation.background} p-5 transition-all duration-200 hover:-translate-y-0.5 sm:p-6`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  aria-hidden="true"
                                  className={`h-2 w-2 rounded-full ${presentation.dot}`}
                                />

                                <p
                                  className={`text-[9px] font-black uppercase tracking-[0.18em] ${presentation.text}`}
                                >
                                  {
                                    presentation.label
                                  }
                                </p>
                              </div>

                              <h3 className="mt-3 text-lg font-extrabold tracking-tight text-white">
                                {node.title}
                              </h3>
                            </div>

                            <span
                              className={`rounded-full border ${presentation.border} px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${presentation.text}`}
                            >
                              {
                                connections.length
                              }{" "}
                              links
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-7 text-[#B5C3D2] sm:text-base">
                            {node.description}
                          </p>

                          {connections.length >
                          0 ? (
                            <div className="mt-6 border-t border-[#17446D]/50 pt-5">
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6F879F]">
                                  Connections
                                </p>

                                <span
                                  className={`text-xs font-bold ${presentation.text}`}
                                >
                                  {
                                    connections.length
                                  }
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
                                          className={`absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full ${presentation.dot}`}
                                        />

                                        <p className="text-sm leading-6 text-[#8EA3B7]">
                                          <span className="font-bold text-[#D7E1EA]">
                                            {getNodeTitle(
                                              connectedNodeId,
                                              graph.nodes
                                            )}
                                          </span>

                                          <span className="text-[#58748E]">
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
                            <p className="mt-6 border-t border-[#17446D]/50 pt-5 text-sm leading-6 text-[#6F879F]">
                              No additional
                              relationships were
                              identified for this
                              entity.
                            </p>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>
              </>
            ) : (
              <div
                role="status"
                className="mt-6 rounded-2xl border border-dashed border-[#214B70] bg-[#020D21]/55 p-6"
              >
                <p className="text-sm leading-6 text-[#8EA3B7]">
                  No related entities were
                  identified for this story.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-dashed border-[#214B70] bg-[#020D21]/55 p-6 sm:p-8"
          >
            <p className="text-sm leading-7 text-[#8EA3B7] sm:text-base">
              The Angle Report could not
              generate connected story context
              from the available article
              information.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}