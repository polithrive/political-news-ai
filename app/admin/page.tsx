import Link from "next/link";

const metrics = [
  {
    label: "System status",
    value: "Healthy",
    detail: "Core services operational",
  },
  {
    label: "Average report time",
    value: "20s",
    detail: "Performance optimization in progress",
  },
  {
    label: "Reports generated today",
    value: "0",
    detail: "Real analytics coming after Alpha",
  },
  {
    label: "User satisfaction",
    value: "—",
    detail: "Awaiting beta feedback",
  },
];

const systemItems = [
  {
    name: "News API",
    status: "Operational",
  },
  {
    name: "OpenAI API",
    status: "Operational",
  },
  {
    name: "Intelligence Report",
    status: "Operational",
  },
  {
    name: "PoliticalPulse Debate™",
    status: "Operational",
  },
  {
    name: "Intelligence Graph",
    status: "Operational",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
              PoliticalPulse Admin
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Founder Dashboard
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              Monitor platform health, AI performance, report
              generation, user feedback, and future revenue
              metrics from one place.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            Return to PoliticalPulse
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
            >
              <p className="text-sm font-semibold text-slate-400">
                {metric.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-white">
                {metric.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {metric.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              System health
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Service status
            </h2>

            <div className="mt-6 space-y-3">
              {systemItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                >
                  <span className="font-medium text-slate-200">
                    {item.name}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <span
                      className="h-2 w-2 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />

                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              AI performance
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Current performance priorities
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-300">
                    Intelligence Report
                  </span>

                  <span className="font-bold text-amber-400">
                    ~20 seconds
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Current highest-priority performance issue.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-300">
                    Debate API
                  </span>

                  <span className="font-bold text-slate-400">
                    Measurement pending
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-300">
                    Intelligence Graph
                  </span>

                  <span className="font-bold text-slate-400">
                    Loads independently
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
              Usage
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Product activity
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Report views, AI Chat usage, source engagement, and
              returning-user activity will appear here once real
              analytics are connected.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
              Feedback
            </p>

            <h2 className="mt-3 text-xl font-bold">
              User sentiment
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Helpful ratings, issue reports, and improvement
              suggestions will be summarized here during the
              closed Alpha.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Revenue
            </p>

            <h2 className="mt-3 text-xl font-bold">
              Future subscription metrics
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Subscriber growth, conversion, monthly recurring
              revenue, and AI cost per user will appear here after
              monetization is introduced.
            </p>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
            Alpha notice
          </p>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            This dashboard currently contains development and
            placeholder metrics. Before external launch, the admin
            route should be protected with authentication so that
            operational information is not publicly accessible.
          </p>
        </div>
      </section>
    </main>
  );
}