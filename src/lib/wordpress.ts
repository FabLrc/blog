import { GraphQLClient, gql } from 'graphql-request';
import { Post, Category, GeneralSettings } from '@/types/wordpress';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WORDPRESS_API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined in .env.local");
}

export const client = new GraphQLClient(WORDPRESS_API_URL);

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
 */
export async function getAdjacentPosts(currentPostDate: string, currentPostId: number): Promise<{
  previousPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
}> {
  try {
    const allPostsQuery = gql`
      query GetAllPostsSorted {
        posts(first: 1000, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            databaseId
            slug
            title
            date
          }
        }
      }
    `;

    const data = await client.request<{
      posts: { nodes: { databaseId: number; slug: string; title: string; date: string }[] };
    }>(allPostsQuery);

    const posts = data.posts.nodes;
    const currentIndex = posts.findIndex((p) => p.databaseId === currentPostId);

    if (currentIndex === -1) {
      return { previousPost: null, nextPost: null };
    }

    // Posts are sorted DESC (newest first), so:
    // - previousPost (older) = next index in array (currentIndex + 1)
    // - nextPost (newer) = previous index in array (currentIndex - 1)
    return {
      previousPost: currentIndex < posts.length - 1 ? { slug: posts[currentIndex + 1].slug, title: posts[currentIndex + 1].title } : null,
      nextPost: currentIndex > 0 ? { slug: posts[currentIndex - 1].slug, title: posts[currentIndex - 1].title } : null,
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

