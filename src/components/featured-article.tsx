import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { Post } from "@/types/wordpress";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedArticleProps {
  post: Post;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  const coverUrl = post.featuredImage?.node.sourceUrl || "/placeholder.jpg";

  const publishedDate = new Date(post.date).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate reading time
  const plainText = (post.content || "").replace(/<[^>]*>?/gm, '');
  const readingMinutes = calculateReadingTime(plainText);
  const readingTimeText = formatReadingTime(readingMinutes);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt={post.featuredImage?.node.altText || post.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority
        />
        {/* Display multiple categories */}
        {post.categories.nodes.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {post.categories.nodes.map((category) => (
              <Badge key={category.slug} className="bg-primary text-primary-foreground">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-bold group-hover:text-primary">
          {post.title}
        </h2>
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{publishedDate}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTimeText}
          </span>
        </div>
        <div 
          className="line-clamp-3 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      </div>
    </Link>
  );
}
