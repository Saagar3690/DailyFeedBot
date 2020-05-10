const url =
  "https://newsapi.org/v2/top-headlines?country=us&apiKey=e2e4f83af67141a1a14784e093e25a3a";

export async function getNews() {
  let result = await fetch(url).then(response => response.json());
  return result.articles;
}
