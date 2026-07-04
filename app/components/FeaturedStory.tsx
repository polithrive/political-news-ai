import { featuredStory } from "../data/featuredStory";

export default function FeaturedStory() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-6">Featured Story</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <p className="text-red-500 font-semibold mb-3">
          {featuredStory.category}
        </p>

        <h3 className="text-4xl font-bold mb-4">
          {featuredStory.title}
        </h3>

        <p className="text-gray-400 text-lg mb-6">
          {featuredStory.summary}
        </p>

        <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold">
          {featuredStory.button}
        </button>
      </div>
    </section>
  );
}