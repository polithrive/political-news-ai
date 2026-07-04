const features = [
  "AI-generated summaries",
  "Left, center, and right viewpoint comparison",
  "Bias analysis",
  "Fact-check scoring",
  "Personalized political news feed",
  "Global political coverage",
];

export default function AIFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-3xl font-bold mb-6">Why PoliticalPulse AI?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <p className="text-lg font-semibold">✓ {feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
}