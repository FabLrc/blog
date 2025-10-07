import ArticleCard from "@/components/article-card";
import { FeaturedArticle } from "@/components/featured-article";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getArticles, getSiteConfig, getStrapiImageUrl } from "@/lib/strapi";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default async function Home() {
  const [articles, siteConfig] = await Promise.all([
    getArticles(4),
    getSiteConfig(),
  ]);
  
  const [featuredArticle, ...recentArticles] = articles;

  // Get avatar URL from Strapi or fallback to GitHub
  const avatarUrl = siteConfig.profileAvatar
    ? getStrapiImageUrl(siteConfig.profileAvatar.url)
    : `https://github.com/${siteConfig.profileUsername}.png`;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Profile Section */}
      <div className="mb-12 text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarImage src={avatarUrl} alt={siteConfig.profileName} />
          <AvatarFallback>
            {siteConfig.profileName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="mb-2 text-3xl font-bold">{siteConfig.profileName}</h1>
        
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          {siteConfig.profileBio}
        </p>

        <div className="flex justify-center gap-2">
          {siteConfig.socialGithub && (
            <Button variant="outline" size="icon" asChild title="GitHub">
              <a
                href={siteConfig.socialGithub}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {siteConfig.socialLinkedin && (
            <Button variant="outline" size="icon" asChild title="LinkedIn">
              <a
                href={siteConfig.socialLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {siteConfig.socialTwitter && (
            <Button variant="outline" size="icon" asChild title="X (Twitter)">
              <a
                href={siteConfig.socialTwitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Dernier article</h2>
          <FeaturedArticle article={featuredArticle} />
        </div>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Articles récents</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => {
              const categories = article.categories || (article.category ? [article.category] : []);
              
              return (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.description}
                  coverImage={article.cover?.url || ""}
                  categories={categories}
                  publishedAt={article.publishedAt}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* View All Articles Link */}
      {articles.length >= 4 && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/blog">Voir tous les articles</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
