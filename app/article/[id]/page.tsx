import { getNews } from "../../lib/getNews";
export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getSummary(title: string, description: string) {
  const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      title,
      description,
    }),
  });

  const data = await response.json();
  return data.summary;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const articles = await getNews();
  const article = articles[Number(id) - 1];

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="text-red-500 font-semibold">
            ← Back to Home
          </a>

          <h1 className="text-4xl font-bold mt-10">Article not found</h1>
        </div>
      </main>
    );
  }

  const summary = await getSummary(article.title, article.description);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-red-500 font-semibold">
          ← Back to Home
        </a>

        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="mt-10 h-96 w-full rounded-2xl object-cover"
          />
        )}

        <p className="text-red-500 font-semibold mt-10">
          {article.source.name}
        </p>

        <h1 className="text-5xl font-bold mt-4">{article.title}</h1>

        <p className="text-gray-500 mt-4">
          Published: {new Date(article.publishedAt).toLocaleString()}
        </p>

        <p className="text-gray-400 mt-6 text-lg">{article.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold">AI Summary</h2>
            <p className="text-gray-400 mt-3">{summary}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold">Bias Analysis</h2>
            <p className="text-gray-400 mt-3">Perspective rating: Neutral</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold">Key Facts</h2>
            <p className="text-gray-400 mt-3">
              Important facts and context will appear here.
            </p>
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
        >
          Read Original Article →
        </a>
      </div>
    </main>
  );
}