import { GraphQLClient, gql } from 'graphql-request';
import { Post, Category, GeneralSettings, Page, AuthorInfo } from '@/types/wordpress';

/**
 * Decode HTML entities in a string
 * Useful for WordPress content that contains encoded characters
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&nbsp;': ' ',
    '&hellip;': '…',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  return decoded;
}

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WORDPRESS_API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined in .env.local");
}

export const client = new GraphQLClient(WORDPRESS_API_URL);

/**
 * Response type for paginated posts
 */
export interface PaginatedPostsResponse {
  posts: Post[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

/**
 * Fetch paginated posts from WordPress using cursor-based pagination
 */
export async function getPaginatedPosts(
  first: number = 10,
  after?: string,
  categorySlug?: string
): Promise<PaginatedPostsResponse> {
  const query = gql`
    query GetPaginatedPosts($first: Int!, $after: String, $categorySlug: String) {
      posts(
        first: $first
        after: $after
        where: { 
          orderby: { field: DATE, order: DESC }
          ${categorySlug ? 'categoryName: $categorySlug' : ''}
        }
      ) {
        nodes {
          id
          databaseId
          title
          slug
          date
          excerpt
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const data = await client.request<{
      posts: {
        nodes: Post[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>(query, { first, after, categorySlug });

    return {
      posts: data.posts.nodes,
      pageInfo: data.posts.pageInfo,
      totalCount: data.posts.nodes.length,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return {
      posts: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      totalCount: 0,
    };
  }
}

/**
 * Fetch all published posts from WordPress
 */
export async function getAllPosts(limit: number = 10, includeContent: boolean = true): Promise<Post[]> {
  const query = gql`
    query GetAllPosts($limit: Int!) {
      posts(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          databaseId
          title
          slug
          date
          excerpt
          ${includeContent ? 'content' : ''}
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<{ posts: { nodes: Post[] } }>(query, { limit });
    return data.posts.nodes;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        date
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    `;
  
  try {
    const data = await client.request<{ post: Post }>(query, { slug });
    return data.post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const query = gql`
    query GetAllCategories {
      categories(first: 100) {
        nodes {
          id
          databaseId
          name
          slug
          count
        }
      }
    }
  `;

  try {
    const data = await client.request<{ categories: { nodes: Category[] } }>(query);
    return data.categories.nodes;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch site general settings
 */
export async function getGeneralSettings(): Promise<GeneralSettings | null> {
  const query = gql`
    query GetGeneralSettings {
      generalSettings {
        title
        description
        url
      }
    }
  `;

  try {
    const data = await client.request<{ generalSettings: GeneralSettings }>(query);
    return data.generalSettings;
  } catch (error) {
    console.error("Error fetching general settings:", error);
    return null;
  }
}

/**
 * Search posts by query string
 */
export async function searchPosts(searchQuery: string): Promise<Post[]> {
  const query = gql`
    query SearchPosts($search: String!) {
      posts(where: { search: $search }) {
        nodes {
          id
          databaseId
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<{ posts: { nodes: Post[] } }>(query, { search: searchQuery });
    return data.posts.nodes;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

/**
 * Get adjacent posts (previous and next) for a given post
 * Optimized: Uses targeted GraphQL queries instead of fetching all posts
 */
export async function getAdjacentPosts(currentPostDate: string, currentPostId: number): Promise<{
  previousPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
}> {
  // Parse the date to extract year, month, day for WPGraphQL dateQuery
  const date = new Date(currentPostDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  // Query for the previous post (older - published before current date)
  const previousPostQuery = gql`
    query GetPreviousPost($year: Int!, $month: Int!, $day: Int!, $excludeId: [ID]!) {
      posts(
        first: 1
        where: {
          orderby: { field: DATE, order: DESC }
          dateQuery: { before: { year: $year, month: $month, day: $day } }
          notIn: $excludeId
        }
      ) {
        nodes {
          slug
          title
        }
      }
    }
  `;

  // Query for the next post (newer - published after current date)
  const nextPostQuery = gql`
    query GetNextPost($year: Int!, $month: Int!, $day: Int!, $excludeId: [ID]!) {
      posts(
        first: 1
        where: {
          orderby: { field: DATE, order: ASC }
          dateQuery: { after: { year: $year, month: $month, day: $day } }
          notIn: $excludeId
        }
      ) {
        nodes {
          slug
          title
        }
      }
    }
  `;

  try {
    // Execute both queries in parallel for better performance
    const [previousData, nextData] = await Promise.all([
      client.request<{ posts: { nodes: { slug: string; title: string }[] } }>(
        previousPostQuery,
        { year, month, day, excludeId: [String(currentPostId)] }
      ),
      client.request<{ posts: { nodes: { slug: string; title: string }[] } }>(
        nextPostQuery,
        { year, month, day, excludeId: [String(currentPostId)] }
      ),
    ]);

    return {
      previousPost: previousData.posts.nodes[0] || null,
      nextPost: nextData.posts.nodes[0] || null,
    };
  } catch (error) {
    console.error("Error fetching adjacent posts:", error);
    return {
      previousPost: null,
      nextPost: null,
    };
  }
}

/**
 * Subscribe to newsletter (Mock implementation for now)
 */
export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual newsletter subscription (e.g. Mailchimp, MailPoet, etc.)
  console.log(`Subscribing ${email} to newsletter...`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Inscription réussie ! (Simulation)",
      });
    }, 1000);
  });
}

/**
 * Lightweight type for sitemap entries
 */
export interface SitemapPost {
  slug: string;
  date: string;
}

/**
 * Fetch only slug and date for sitemap generation (optimized, lightweight query)
 * Uses cursor-based pagination to handle large amounts of posts efficiently
 */
export async function getAllPostsForSitemap(): Promise<SitemapPost[]> {
  const allPosts: SitemapPost[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;
  
  const query = gql`
    query GetPostsForSitemap($first: Int!, $after: String) {
      posts(
        first: $first
        after: $after
        where: { orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          slug
          date
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    // Fetch posts in batches of 100 to avoid timeouts
    while (hasNextPage) {
      const response: {
        posts: {
          nodes: SitemapPost[];
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
      } = await client.request(query, { first: 100, after: afterCursor });

      allPosts.push(...response.posts.nodes);
      hasNextPage = response.posts.pageInfo.hasNextPage;
      afterCursor = response.posts.pageInfo.endCursor;
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return [];
  }
}

/**
 * Fetch a page by its slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = gql`
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        databaseId
        title
        slug
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<{ page: Page | null }>(query, { slug });
    if (data.page) {
      return {
        ...data.page,
        title: decodeHtmlEntities(data.page.title),
        content: data.page.content,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

/**
 * Fetch author information (primary author/site owner)
 * Uses posts to get the author info since user queries may require authentication
 */
export async function getAuthorInfo(): Promise<AuthorInfo | null> {
  const query = gql`
    query GetAuthorInfo {
      posts(first: 1, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          author {
            node {
              id
              databaseId
              name
              firstName
              lastName
              description
              avatar {
                url
              }
              url
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request<{ 
      posts: { 
        nodes: Array<{ 
          author: { 
            node: AuthorInfo 
          } 
        }> 
      } 
    }>(query);
    
    if (data.posts.nodes.length > 0 && data.posts.nodes[0].author?.node) {
      const author = data.posts.nodes[0].author.node;
      return {
        ...author,
        name: decodeHtmlEntities(author.name || ''),
        description: decodeHtmlEntities(author.description || ''),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching author info:", error);
    return null;
  }
}

/**
 * Fetch total posts count by counting all posts
 */
export async function getPostsCount(): Promise<number> {
  const query = gql`
    query GetPostsCount {
      posts(first: 100) {
        nodes {
          id
        }
      }
    }
  `;

  try {
    const data = await client.request<{ posts: { nodes: Array<{ id: string }> } }>(query);
    return data.posts.nodes.length || 0;
  } catch (error) {
    console.error("Error fetching posts count:", error);
    return 0;
  }
}

