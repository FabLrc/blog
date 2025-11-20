export interface Post {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  content?: string; // Optional as it may not be included in list views
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  author: {
    node: {
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}


export interface Category {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
}

export interface Author {
  id: string;
  databaseId: number;
  name: string;
  firstName: string;
  lastName: string;
  avatar: {
    url: string;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface GeneralSettings {
  title: string;
  description: string;
  url: string;
}

export interface Menu {
  nodes: {
    id: string;
    label: string;
    path: string;
    parentId: string | null;
  }[];
}

