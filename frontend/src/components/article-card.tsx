import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  categories?: { nodes: { name: string; slug: string }[] };
  date: string;
  content?: string;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  featuredImage,
  categories,
  date,
  content = "",
}: ArticleCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate reading time from HTML content
  // Strip HTML tags for calculation
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const readingMinutes = calculateReadingTime(plainText);
  const readingTimeText = formatReadingTime(readingMinutes);

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <Card className="h-full transition-all hover:shadow-lg overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={featuredImage || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            {categories?.nodes.map((category) => (
              <Badge key={category.slug} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary">
            {title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTimeText}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="line-clamp-3 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
