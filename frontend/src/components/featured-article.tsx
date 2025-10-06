import Image from "next/image";
import Link from "next/link";
import { StrapiArticle } from "@/types/strapi";
import { getStrapiImageUrl } from "@/lib/strapi";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface FeaturedArticleProps {
  article: StrapiArticle;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const coverUrl = article.cover
    ? getStrapiImageUrl(article.cover.url)
    : "/default-image.png";

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt={article.cover?.alternativeText || article.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority
        />
        {/* Display multiple categories */}
        {(() => {
          const categories = article.categories || (article.category ? [article.category] : []);
          if (categories.length > 0) {
            return (
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="secondary"
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            );
          }
          return null;
        })()}
      </div>
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {article.title}
        </h2>
        <p className="mb-4 text-muted-foreground line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <time dateTime={article.publishedAt}>{publishedDate}</time>
        </div>
      </div>
    </Link>
  );
}
