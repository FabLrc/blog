import BlockRenderer from "@/components/block-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { profileConfig } from "@/config/profile";
import { getArticleBySlug, getStrapiImageUrl } from "@/lib/strapi";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  // Utilise l'avatar de l'auteur depuis Strapi, sinon l'avatar de profil local
  const authorAvatarUrl = article.author?.avatar
    ? getStrapiImageUrl(article.author.avatar.url)
    : profileConfig.avatar;

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
