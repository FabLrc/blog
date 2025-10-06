import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/strapi";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BlockRenderer from "@/components/block-renderer";
import NewsletterForm from "@/components/newsletter-form";
import { ArrowLeft } from "lucide-react";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

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
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const coverImageUrl = article.cover
    ? getStrapiImageUrl(article.cover.url)
    : null;

  const authorAvatarUrl = article.author?.avatar
    ? getStrapiImageUrl(article.author.avatar.url)
    : null;

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

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au blog
      </Link>

      {/* Category badge */}
      {article.category && (
        <div className="mb-4">
          <Badge variant="secondary" className="text-sm">
            {article.category.name}
          </Badge>
        </div>
      )}

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
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </>
        )}
        {!article.author && (
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
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
      <div className="prose prose-lg max-w-none">
        {article.blocks && <BlockRenderer blocks={article.blocks} />}
      </div>

      <Separator className="my-12" />

      {/* Newsletter subscription */}
      <div className="my-12">
        <NewsletterForm source="article" />
      </div>

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
  );
}
