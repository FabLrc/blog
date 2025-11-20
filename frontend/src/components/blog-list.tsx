"use client";

import { Post, Category } from "@/types/wordpress";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArticleCard from "./article-card";
import { CategoryFilter } from "./category-filter";

interface BlogListProps {
  initialPosts: Post[];
  categories: Category[];
}

export function BlogList({ initialPosts, categories }: BlogListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateUrl = useCallback((categorySlugs: string[]) => {
    const currentCategorySlug = searchParams.get("category");
    
    if (categorySlugs.length === 0) {
      // Only push if we're not already on /blog
      if (currentCategorySlug !== null) {
        router.push("/blog");
      }
    } else {
      // Get the first selected category's slug for URL
      const selectedSlug = categorySlugs[0];
      if (selectedSlug && currentCategorySlug !== selectedSlug) {
        router.push(`/blog?category=${selectedSlug}`);
      }
    }
  }, [router, searchParams]);

  // Read category from URL on mount
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      // Verify it exists in our categories list
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategories([category.slug]);
      }
    }
  }, [searchParams, categories]);

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categorySlug)
        ? prev.filter((id) => id !== categorySlug)
        : [categorySlug]; // Single selection mode for now to match URL behavior
      
      updateUrl(newSelection);
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    updateUrl([]);
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return initialPosts;
    }

    return initialPosts.filter((post) => {
      // Check if post has any of the selected categories
      return post.categories.nodes.some((cat) => 
        selectedCategories.includes(cat.slug)
      );
    });
  }, [initialPosts, selectedCategories]);

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onClearFilters={handleClearFilters}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <ArticleCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            featuredImage={post.featuredImage?.node.sourceUrl}
            categories={post.categories}
            date={post.date}
            content={post.content}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun article ne correspond à vos critères.
          </p>
        </div>
      )}
    </div>
  );
}
