export default function PerspectiveComparison() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-2">
        Compare Perspectives
      </h2>

      <p className="text-gray-400 mb-10">
        Read how different news organizations cover the same political story.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            Left
          </h3>

          <p className="text-gray-300">
            CNN • MSNBC • HuffPost
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            Center
          </h3>

          <p className="text-gray-300">
            AP • Reuters • BBC
          </p>
        </div>

        <div className="bg-red-900 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            Right
          </h3>

          <p className="text-gray-300">
            Fox News • Daily Wire • NY Post
          </p>
        </div>

      </div>

      <div className="mt-8 bg-slate-900 rounded-xl p-8">
        <h3 className="text-xl font-bold mb-4">
          AI Summary
        </h3>

        <p className="text-gray-400">
          Our AI analyzes articles across multiple sources,
          identifies common facts, highlights differences in framing,
          and summarizes the story in neutral language.
        </p>
      </div>

    </section>
  );
}