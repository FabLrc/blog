import { Card } from "@/components/ui/card";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArticleNavigationProps {
  previousArticle: StrapiArticle | null;
  nextArticle: StrapiArticle | null;
}

export function ArticleNavigation({
  previousArticle,
  nextArticle,
}: ArticleNavigationProps) {
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t">
      {/* Previous Article */}
      <div className={!previousArticle ? "invisible" : ""}>
        {previousArticle && (
          <Link
            href={`/blog/${previousArticle.slug}`}
            className="group block h-full"
          >
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Article précédent</span>
              </div>
              <div className="flex gap-3">
                {previousArticle.cover?.url && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={getStrapiImageUrl(previousArticle.cover.url)}
                      alt={previousArticle.cover.alternativeText || ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {previousArticle.title}
                  </h3>
                  {previousArticle.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {previousArticle.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Next Article */}
      <div className={!nextArticle ? "invisible" : ""}>
        {nextArticle && (
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="group block h-full"
          >
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                <span>Article suivant</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex gap-3 flex-row-reverse">
                {nextArticle.cover?.url && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={getStrapiImageUrl(nextArticle.cover.url)}
                      alt={nextArticle.cover.alternativeText || ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h3>
                  {nextArticle.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {nextArticle.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
