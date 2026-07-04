import { latestNews } from "../data/latestNews";

export default function LatestNews() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-6">Latest News</h2>

      <div className="space-y-4">
        {latestNews.map((article) => (
          <div
            key={article.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-red-500 transition"
          >
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-gray-400 mt-2">{article.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}