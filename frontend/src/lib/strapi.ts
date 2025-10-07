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
 * Fetch site configuration from Strapi
 */
export async function getSiteConfig() {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/site-config?populate=*`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch site config: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch site config: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Single type returns data directly, not in an array
    return data.data || data;
  } catch (error) {
    console.error("Error fetching site config:", error);
    // Return default config if fetch fails
    return {
      siteName: "Mon Blog",
      siteDescription: "Mon super blog personnel",
      siteUrl: "http://localhost:3000",
      profileName: "John Doe",
      profileUsername: "johndoe",
      profileBio: "Développeur passionné de technologie",
      profileEmail: "contact@example.com",
      profileAvatar: undefined,
      socialGithub: "https://github.com",
      socialTwitter: "https://x.com",
      socialLinkedin: "https://linkedin.com",
      socialEmail: "contact@example.com",
      metaDescription: "Bienvenue sur mon blog personnel où je partage des articles sur le développement web et la technologie.",
      metaKeywords: "développement web, tech",
      logo: undefined,
      favicon: undefined,
      footerText: "Mon super blog créé avec Next.js et Strapi",
      newsletterEnabled: true,
      commentsEnabled: false,
    };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks.forEach((block: any) => {
    if (block.__component === 'shared.rich-text' && block.body) {
      text += block.body + ' ';
    } else if (block.__component === 'shared.quote' && block.body) {
      text += block.body + ' ';
    }
  });

  return text;
}

/**
 * Search articles by query string
 */
export async function searchArticles(query: string): Promise<StrapiArticle[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Search in title and description
    const response = await fetch(
      `${STRAPI_API_URL}/articles?` +
      `filters[$or][0][title][$containsi]=${encodeURIComponent(query)}&` +
      `filters[$or][1][description][$containsi]=${encodeURIComponent(query)}&` +
      `populate[0]=cover&populate[1]=categories&populate[2]=author.avatar&` +
      `sort[0]=publishedAt:desc&` +
      `pagination[limit]=10`,
      {
        next: { revalidate: 0 }, // Don't cache search results
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search articles: ${response.statusText}`);
    }

    const data: StrapiResponse<StrapiArticle[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
}
