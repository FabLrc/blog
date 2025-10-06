import { getArticles } from "@/lib/strapi";
import { FeaturedArticle } from "@/components/featured-article";
import ArticleCard from "@/components/article-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const articles = await getArticles(4);
  const [featuredArticle, ...recentArticles] = articles;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Profile Section */}
      <div className="mb-12 text-center">
        <Avatar className="mx-auto mb-4 h-24 w-24">
          <AvatarImage src="https://github.com/FabLrc.png" alt="FabLrc" />
          <AvatarFallback>FL</AvatarFallback>
        </Avatar>
        
        <h1 className="mb-2 text-3xl font-bold">FabLrc</h1>
        
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Développeur curieux qui partage ses découvertes autour du web, de l&apos;intelligence artificielle et des crypto-monnaies. 
          J&apos;écris pour me souvenir et pour partager avec d&apos;autres.
        </p>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/FabLrc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
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
