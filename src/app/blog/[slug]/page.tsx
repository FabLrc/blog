import { ArticleNavigation } from "@/components/article-navigation";
import ArticleTOC from "@/components/article-toc";
import BlockRenderer from "@/components/block-renderer";
import ReadingProgress from "@/components/reading-progress";
import SocialShareSidebar from "@/components/social-share-sidebar";
import SocialShareMobile from "@/components/social-share-mobile";
import { Breadcrumb } from "@/components/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getAdjacentPosts, getGeneralSettings } from "@/lib/wordpress";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

// Enable ISR with 1 hour revalidation (fallback if webhook fails)
export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate JSON-LD structured data for blog articles
 * This helps search engines understand the content and enables rich snippets
 */
function generateArticleJsonLd(post: {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content?: string;
  author: { node: { name: string; avatar: { url: string } } };
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  categories: { nodes: { name: string; slug: string }[] };
}, siteUrl: string, siteName: string) {
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const plainExcerpt = post.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 160);
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": plainExcerpt,
    "url": articleUrl,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.node.name,
      "image": post.author.node.avatar.url,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(post.featuredImage?.node?.sourceUrl && {
      "image": {
        "@type": "ImageObject",
        "url": post.featuredImage.node.sourceUrl,
      },
    }),
    "articleSection": post.categories.nodes.map(cat => cat.name).join(", "),
    "keywords": post.categories.nodes.map(cat => cat.name).join(", "),
  };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteConfig] = await Promise.all([
    getPostBySlug(slug),
    getGeneralSettings(),
  ]);

  if (!post) {
    return {
      title: "Article introuvable",
    };
  }

  const siteUrl = siteConfig?.url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const plainExcerpt = post.excerpt.replace(/<[^>]*>?/gm, '').slice(0, 160);
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const keywords = post.categories.nodes.map(cat => cat.name);

  return {
    title: post.title,
    description: plainExcerpt,
    keywords: keywords,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: plainExcerpt,
      type: "article",
      url: articleUrl,
      publishedTime: post.date,
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      images: post.featuredImage?.node?.sourceUrl ? [{ url: post.featuredImage.node.sourceUrl }] : undefined,
      siteName: siteConfig?.title || "Mon Blog",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainExcerpt,
      images: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [post, siteConfig] = await Promise.all([
    getPostBySlug(slug),
    getGeneralSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const siteUrl = siteConfig?.url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = siteConfig?.title || "Mon Blog";

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

  // Generate JSON-LD structured data
  const jsonLd = generateArticleJsonLd(post, siteUrl, siteName);

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ReadingProgress />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <article className="max-w-4xl mx-auto lg:mx-0 w-full">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Social Share Mobile */}
            <SocialShareMobile
              title={post.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`}
            />

            {/* Table of Contents */}
            <ArticleTOC />

            {/* Content */}
            <div id="article-content" className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
              <BlockRenderer content={post.content || ''} />
            </div>

            {/* Navigation */}
            <ArticleNavigation
              previousPost={previousPost}
              nextPost={nextPost}
            />
          </article>

          {/* Social Share Sidebar */}
          <SocialShareSidebar
            title={post.title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`}
          />
        </div>
      </div>
    </>
  );
}
