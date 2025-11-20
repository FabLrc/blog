import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ArticleNavigationProps {
  previousPost?: { slug: string; title: string } | null;
  nextPost?: { slug: string; title: string } | null;
}

export function ArticleNavigation({
  previousPost,
  nextPost,
}: ArticleNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t">
      {/* Previous Article */}
      <div className={!previousPost ? "invisible" : ""}>
        {previousPost && (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group block h-full"
          >
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Article précédent</span>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {previousPost.title}
                  </h3>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Next Article */}
      <div className={!nextPost ? "invisible" : ""}>
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group block h-full text-right"
          >
            <Card className="p-4 h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                <span>Article suivant</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex gap-3 justify-end">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
