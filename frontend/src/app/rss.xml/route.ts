import { profileConfig } from "@/config/profile";
import { getArticles, getStrapiImageUrl } from "@/lib/strapi";

export async function GET() {
  const articles = await getArticles();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const rssItems = articles
    .map((article) => {
      const articleUrl = `${siteUrl}/blog/${article.slug}`;
      const imageUrl = article.cover
        ? getStrapiImageUrl(article.cover.url)
        : undefined;
      
      const categories = article.categories || (article.category ? [article.category] : []);
      const categoryTags = categories
        .map((cat) => `<category>${cat.name}</category>`)
        .join("\n      ");

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.description || ""}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      ${article.author ? `<author>${article.author.email || "noreply@example.com"} (${article.author.name})</author>` : ""}
      ${categoryTags}
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${profileConfig.blogTitle}</title>
    <link>${siteUrl}</link>
    <description>Blog personnel - Partage de connaissances et d'expériences</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
