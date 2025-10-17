import { ArticleNavigation } from "@/components/article-navigation";
import ArticleSidebar from "@/components/article-sidebar";
import BlockRenderer from "@/components/block-renderer";
import ReadingProgress from "@/components/reading-progress";
import { Breadcrumb } from "@/components/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { extractTextFromBlocks, getArticleBySlug, getNextArticle, getPreviousArticle, getSiteConfig, getStrapiImageUrl } from "@/lib/strapi";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article introuvable",
    };
  }

  const coverImageUrl = article.cover
    ? getStrapiImageUrl(article.cover.url)
    : undefined;

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: coverImageUrl ? [{ url: coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: coverImageUrl ? [coverImageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get previous and next articles and site config
  const [previousArticle, nextArticle, siteConfig] = await Promise.all([
    getPreviousArticle(article.publishedAt),
    getNextArticle(article.publishedAt),
    getSiteConfig(),
  ]);

  const coverImageUrl = article.cover
    ? getStrapiImageUrl(article.cover.url)
    : null;

  // Utilise l'avatar de l'auteur depuis Strapi, sinon l'avatar de profil depuis siteConfig ou GitHub
  const authorAvatarUrl = article.author?.avatar
    ? getStrapiImageUrl(article.author.avatar.url)
    : siteConfig.profileAvatar
    ? getStrapiImageUrl(siteConfig.profileAvatar.url)
    : `https://github.com/${siteConfig.profileUsername}.png`;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Get initials for avatar fallback
  const authorInitials = article.author?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // URL de l'article pour le partage
  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${article.slug}`;

  // Calculate reading time
  const articleText = extractTextFromBlocks(article.blocks || []);
  const readingMinutes = calculateReadingTime(articleText);
  const readingTimeText = formatReadingTime(readingMinutes);

  // Build breadcrumb items
  const categories = article.categories || (article.category ? [article.category] : []);
  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    ...(categories.length > 0
      ? [{ label: categories[0].name, href: `/blog?category=${categories[0].slug}` }]
      : []),
    { label: article.title },
  ];

  return (
    <>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <ReadingProgress />
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

      {/* Categories badges */}
      {(() => {
        const categories = article.categories || (article.category ? [article.category] : []);
        if (categories.length > 0) {
          return (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge key={cat.id} variant="secondary" className="text-sm">
                  {cat.name}
                </Badge>
              ))}
            </div>
          );
        }
        return null;
      })()}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        {article.title}
      </h1>

      {/* Description */}
      {article.description && (
        <p className="text-xl text-muted-foreground mb-6">
          {article.description}
        </p>
      )}

      {/* Author and date */}
      <div className="flex items-center gap-4 mb-8">
        {article.author && (
          <>
            <Avatar className="w-12 h-12">
              {authorAvatarUrl && (
                <AvatarImage src={authorAvatarUrl} alt={article.author.name} />
              )}
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{article.author.name}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formattedDate}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTimeText}</span>
                </div>
              </div>
            </div>
          </>
        )}
        {!article.author && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTimeText}</span>
            </div>
          </div>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Cover image */}
      {coverImageUrl && (
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
          <Image
            src={coverImageUrl}
            alt={article.cover?.alternativeText || article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article content blocks */}
      <div className="prose prose-lg max-w-none" id="article-content">
        {article.blocks && <BlockRenderer blocks={article.blocks} />}
      </div>

      {/* Article Navigation */}
      <ArticleNavigation
        previousArticle={previousArticle}
        nextArticle={nextArticle}
      />

      <Separator className="my-12" />

      {/* Back to blog link */}
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voir tous les articles
        </Link>
      </div>
    </article>

    {/* Article Sidebar - Fixed on the right (TOC + Share) */}
    <ArticleSidebar title={article.title} url={articleUrl} />
    </>
  );
}
