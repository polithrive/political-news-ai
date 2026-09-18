import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getNews } from "../../lib/getNews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type ArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getSummary(
  title: string,
  description: string
): Promise<string> {
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

  if (!response.ok) {
    return "AI summary is currently unavailable.";
  }

  const data = await response.json();

  return String(data.summary ?? "AI summary is currently unavailable.");
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { id } = await params;
  const articles = await getNews();
  const article = articles[Number(id) - 1];

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 px-8 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="font-semibold text-red-500">
            ← Back to Home
          </Link>

          <h1 className="mt-10 text-4xl font-bold">
            Article not found
          </h1>
        </div>
      </main>
    );
  }

  const summary = await getSummary(
    article.title,
    article.description
  );

  return (
    <main className="min-h-screen bg-slate-950 px-8 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="font-semibold text-red-500">
          ← Back to Home
        </Link>

     {article.urlToImage && (
  <div className="relative mt-10 h-96 w-full overflow-hidden rounded-2xl">
    <Image
      src={article.urlToImage}
      alt={article.title}
      fill
      className="object-cover"
      sizes="100vw"
      unoptimized
    />
  </div>
)}

        <p className="mt-10 font-semibold text-red-500">
          {article.source.name}
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          {article.title}
        </h1>

        <p className="mt-4 text-gray-500">
          Published:{" "}
          {new Date(article.publishedAt).toLocaleString()}
        </p>

        <p className="mt-6 text-lg text-gray-400">
          {article.description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              AI Summary
            </h2>

            <p className="mt-3 text-gray-400">
              {summary}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Bias Analysis
            </h2>

            <p className="mt-3 text-gray-400">
              Perspective rating: Neutral
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Key Facts
            </h2>

            <p className="mt-3 text-gray-400">
              Important facts and context will appear here.
            </p>
          </div>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-lg bg-red-600 px-6 py-3 font-bold transition hover:bg-red-700"
        >
          Read Original Article →
        </a>
      </div>
    </main>
  );
}