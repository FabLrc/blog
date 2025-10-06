import { StrapiArticle, StrapiResponse } from "@/types/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_URL}/api`;

/**
 * Fetch all published articles from Strapi
 */
export async function getArticles(limit?: number): Promise<StrapiArticle[]> {
  try {
    let url = `${STRAPI_API_URL}/articles?populate[0]=cover&populate[1]=categories&populate[2]=author.avatar&sort[0]=publishedAt:desc`;
    
    if (limit) {
      url += `&pagination[limit]=${limit}`;
    }
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

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
      `${STRAPI_API_URL}/articles?filters[slug][$eq]=${slug}&populate[0]=cover&populate[1]=categories&populate[2]=author.avatar&populate[3]=blocks`,
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

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${STRAPI_API_URL}/newsletter-subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          email,
          source: source || "website",
          subscribedAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle duplicate email error
      if (response.status === 400 && errorData.error?.message?.includes("unique")) {
        return {
          success: false,
          message: "Cet email est déjà inscrit à la newsletter.",
        };
      }
      
      throw new Error(errorData.error?.message || "Erreur lors de l'inscription");
    }

    return {
      success: true,
      message: "Inscription réussie ! Merci de vous être abonné.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    };
  }
}

/**
 * Fetch all categories from Strapi
 */
export async function getCategories() {
  try {
    const response = await fetch(`${STRAPI_API_URL}/categories?sort[0]=name:asc`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Get the previous article (published earlier)
 */
export async function getPreviousArticle(
  currentPublishedAt: string
): Promise<StrapiArticle | null> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/articles?filters[publishedAt][$lt]=${currentPublishedAt}&populate[0]=cover&sort[0]=publishedAt:desc&pagination[limit]=1`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch previous article: ${response.statusText}`);
    }

    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Error fetching previous article:", error);
    return null;
  }
}

/**
 * Get the next article (published later)
 */
export async function getNextArticle(
  currentPublishedAt: string
): Promise<StrapiArticle | null> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/articles?filters[publishedAt][$gt]=${currentPublishedAt}&populate[0]=cover&sort[0]=publishedAt:asc&pagination[limit]=1`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch next article: ${response.statusText}`);
    }

    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Error fetching next article:", error);
    return null;
  }
}

/**
 * Extract text content from article blocks for reading time calculation
 */
export function extractTextFromBlocks(blocks: unknown[]): string {
  if (!blocks || blocks.length === 0) return '';

  let text = '';

  blocks.forEach((block: any) => {
    if (block.__component === 'shared.rich-text' && block.body) {
      text += block.body + ' ';
    } else if (block.__component === 'shared.quote' && block.body) {
      text += block.body + ' ';
    }
  });

  return text;
}
