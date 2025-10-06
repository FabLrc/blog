import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiCategory } from "@/types/strapi";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  categories?: StrapiCategory[];
  publishedAt: string;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  coverImage,
  categories = [],
  publishedAt,
}: ArticleCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = getStrapiImageUrl(coverImage);

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
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formattedDate}
            </span>
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
