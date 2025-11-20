import { ArticleNavigation } from "@/components/article-navigation";
import ArticleSidebar from "@/components/article-sidebar";
import BlockRenderer from "@/components/block-renderer";
import ReadingProgress from "@/components/reading-progress";
import { Breadcrumb } from "@/components/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getAdjacentPosts } from "@/lib/wordpress";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 160),
      type: "article",
      publishedTime: post.date,
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      images: post.featuredImage?.node?.sourceUrl ? [{ url: post.featuredImage.node.sourceUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 160),
      images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate reading time
  const plainText = (post.content || "").replace(/<[^>]*>?/gm, '');
  const readingMinutes = calculateReadingTime(plainText);
  const readingTimeText = formatReadingTime(readingMinutes);

  // Get adjacent posts
  const { previousPost, nextPost } = await getAdjacentPosts(post.date, post.databaseId);

  return (
    <>
      <ReadingProgress />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <article>
            {/* Header */}
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.nodes.map((category) => (
                  <Badge key={category.slug} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.node.avatar.url} alt={post.author.node.name} />
                    <AvatarFallback>{post.author.node.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-foreground">
                      {post.author.node.name}
                    </span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {readingTimeText}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12 relative w-full overflow-hidden rounded-xl bg-muted" style={{ height: '500px' }}>
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
              <BlockRenderer content={post.content || ''} />
            </div>

            {/* Navigation */}
            <ArticleNavigation
              previousPost={previousPost}
              nextPost={nextPost}
            />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleSidebar
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
