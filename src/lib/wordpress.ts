import { GraphQLClient, gql } from 'graphql-request';
import { Post, Category, GeneralSettings } from '@/types/wordpress';

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
  // Query for the previous post (older - published before current date)
  const previousPostQuery = gql`
    query GetPreviousPost($date: String!, $excludeId: Int!) {
      posts(
        first: 1
        where: {
          orderby: { field: DATE, order: DESC }
          dateBefore: $date
          notIn: [$excludeId]
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
    query GetNextPost($date: String!, $excludeId: Int!) {
      posts(
        first: 1
        where: {
          orderby: { field: DATE, order: ASC }
          dateAfter: $date
          notIn: [$excludeId]
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
        { date: currentPostDate, excludeId: currentPostId }
      ),
      client.request<{ posts: { nodes: { slug: string; title: string }[] } }>(
        nextPostQuery,
        { date: currentPostDate, excludeId: currentPostId }
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
      const data = await client.request<{
        posts: {
          nodes: SitemapPost[];
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
      }>(query, { first: 100, after: afterCursor });

      allPosts.push(...data.posts.nodes);
      hasNextPage = data.posts.pageInfo.hasNextPage;
      afterCursor = data.posts.pageInfo.endCursor;
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return [];
  }
}

