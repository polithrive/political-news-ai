export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=10&apiKey=${apiKey}`,
    {
      next: { revalidate: 300 },
    }
  );

  const data = await response.json();

  return Response.json(data);
}