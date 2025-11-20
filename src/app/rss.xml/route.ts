import { getAllPosts, getGeneralSettings } from "@/lib/wordpress";

export async function GET() {
  const [posts, settings] = await Promise.all([
    getAllPosts(20),
    getGeneralSettings(),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const imageUrl = post.featuredImage?.node.sourceUrl;
      
      const categoryTags = post.categories.nodes
        .map((cat) => `<category>${cat.name}</category>`)
        .join("\n      ");

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.author?.node ? `<author>noreply@example.com (${post.author.node.name})</author>` : ""}
      ${categoryTags}
      ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings?.title || "Mon Blog"}</title>
    <link>${siteUrl}</link>
    <description>${settings?.description || "Blog personnel"}</description>
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
