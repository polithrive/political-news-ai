"use client";

type StoryMemoryProps = {
  topic: string;
  previousEvents: string[];
};

export default function StoryMemory({
  topic,
  previousEvents,
}: StoryMemoryProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
        Story Memory
      </p>

      <h2 className="mt-2 text-2xl font-bold text-white">
        Historical Context
      </h2>

      <p className="mt-2 text-slate-400">
        PoliticalPulse remembers previous developments related to this topic.
      </p>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">
          Topic
        </p>

        <p className="mt-2 rounded-lg bg-slate-800 p-3 text-slate-300">
          {topic}
        </p>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-white">
          Previous Developments
        </p>

        <div className="mt-3 space-y-3">
          {previousEvents.map((event, index) => (
            <div
              key={index}
              className="rounded-lg bg-slate-800 p-3 text-slate-300"
            >
              • {event}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}