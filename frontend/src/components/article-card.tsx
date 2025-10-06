import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { extractTextFromBlocks, getStrapiImageUrl } from "@/lib/strapi";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { StrapiCategory } from "@/types/strapi";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  categories?: StrapiCategory[];
  publishedAt: string;
  blocks?: unknown[];
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  coverImage,
  categories = [],
  publishedAt,
  blocks = [],
}: ArticleCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = getStrapiImageUrl(coverImage);

  // Calculate reading time
  const articleText = extractTextFromBlocks(blocks);
  const readingMinutes = calculateReadingTime(articleText);
  const readingTimeText = formatReadingTime(readingMinutes);

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <Card className="h-full transition-all hover:shadow-lg overflow-hidden">
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          {coverImage ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Pas d&apos;image
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            <div className="flex flex-wrap gap-1.5">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Non catégorisé</Badge>
              )}
            </div>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{readingTimeText}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
