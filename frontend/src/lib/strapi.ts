import { StrapiArticle, StrapiResponse } from "@/types/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_URL}/api`;

/**
 * Fetch all published articles from Strapi
 */
export async function getArticles(): Promise<StrapiArticle[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/articles?populate[0]=cover&populate[1]=category&populate[2]=author.avatar&sort[0]=publishedAt:desc`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/articles?filters[slug][$eq]=${slug}&populate[0]=cover&populate[1]=category&populate[2]=author.avatar&populate[3]=blocks`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get the full URL for a Strapi image
 */
export function getStrapiImageUrl(url: string | undefined): string {
  if (!url) return "/placeholder.jpg";
  
  // If URL is already absolute, return it
  if (url.startsWith("http")) return url;
  
  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}

/**
 * Get the optimal image format from Strapi formats
 */
export function getStrapiImageFormat(
  image: { formats?: Record<string, { url: string }>; url: string } | undefined,
  format: "thumbnail" | "small" | "medium" | "large" = "medium"
): string {
  if (!image) return "/placeholder.jpg";
  
  const formatUrl = image.formats?.[format]?.url || image.url;
  return getStrapiImageUrl(formatUrl);
}
