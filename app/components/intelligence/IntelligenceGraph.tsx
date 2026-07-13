import type {
  GraphConnection,
  GraphNode,
  IntelligenceGraph as IntelligenceGraphData,
} from "@/app/types/intelligenceGraph";

type IntelligenceGraphProps = {
  graph: IntelligenceGraphData;
};

const nodeTypeStyles: Record<GraphNode["type"], string> = {
  Story: "border-red-500/50 bg-red-500/10 text-red-300",
  Person: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  Organization: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  Legislation: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  "Court Case": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  "Government Agency":
    "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  Location: "border-lime-500/40 bg-lime-500/10 text-lime-300",
  Topic: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300",
  "Historical Event":
    "border-orange-500/40 bg-orange-500/10 text-orange-300",
};

function getNodeTitle(
  nodeId: string,
  nodes: GraphNode[]
): string {
  return nodes.find((node) => node.id === nodeId)?.title ?? nodeId;
}

function getConnectionsForNode(
  nodeId: string,
  connections: GraphConnection[]
): GraphConnection[] {
  return connections.filter(
    (connection) =>
      connection.from === nodeId || connection.to === nodeId
  );
}

export default function IntelligenceGraph({
  graph,
}: IntelligenceGraphProps) {
  const centralNode =
    graph.nodes.find((node) => node.id === "story-1") ??
    graph.nodes.find((node) => node.type === "Story");

  const relatedNodes = graph.nodes.filter(
    (node) => node.id !== centralNode?.id
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
          Intelligence Graph
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Connected context
        </h2>

        <p className="mt-3 max-w-3xl text-slate-400">
          Explore the people, organizations, legislation, topics, and events
          connected to this story.
        </p>
      </div>

      {centralNode ? (
        <div className="mt-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Central Story
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {centralNode.title}
            </h3>

            <p className="mt-3 leading-7 text-slate-300">
              {centralNode.description}
            </p>
          </div>

          {relatedNodes.length > 0 && (
            <div className="mx-auto h-10 w-px bg-slate-700" />
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedNodes.map((node) => {
              const connections = getConnectionsForNode(
                node.id,
                graph.connections
              );

              return (
                <article
                  key={node.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
                >
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${nodeTypeStyles[node.type]}`}
                  >
                    {node.type}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {node.title}
                  </h3>

                  <p className="mt-3 leading-6 text-slate-400">
                    {node.description}
                  </p>

                  {connections.length > 0 && (
                    <div className="mt-5 border-t border-slate-800 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Connections
                      </p>

                      <ul className="mt-3 space-y-3">
                        {connections.map((connection, index) => {
                          const connectedNodeId =
                            connection.from === node.id
                              ? connection.to
                              : connection.from;

                          return (
                            <li
                              key={`${connection.from}-${connection.to}-${index}`}
                              className="text-sm text-slate-300"
                            >
                              <span className="font-semibold text-slate-200">
                                {getNodeTitle(
                                  connectedNodeId,
                                  graph.nodes
                                )}
                              </span>
                              <span className="text-slate-500"> — </span>
                              {connection.relationship}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/50 p-6">
          <p className="text-slate-400">
            PoliticalPulse could not generate connected story context from the
            available article information.
          </p>
        </div>
      )}
    </section>
  );
}