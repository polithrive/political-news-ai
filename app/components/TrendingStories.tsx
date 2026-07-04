const stories = [
  {
    title: "Election Updates",
    text: "Track major campaign developments and voter issues.",
  },
  {
    title: "Congress Watch",
    text: "Follow bills, debates, hearings, and key votes.",
  },
  {
    title: "Global Politics",
    text: "See major political stories from around the world.",
  },
];

export default function TrendingStories() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-6">Trending Stories</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.title}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500 transition"
          >
            <h3 className="text-2xl font-bold mb-3">{story.title}</h3>
            <p className="text-gray-400">{story.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}