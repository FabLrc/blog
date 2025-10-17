"use client";

import { StrapiArticle, StrapiCategory } from "@/types/strapi";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArticleCard from "./article-card";
import { CategoryFilter } from "./category-filter";

interface BlogListProps {
  initialArticles: StrapiArticle[];
  categories: StrapiCategory[];
}

export function BlogList({ initialArticles, categories }: BlogListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateUrl = useCallback((categoryIds: string[]) => {
    const currentCategorySlug = searchParams.get("category");
    
    if (categoryIds.length === 0) {
      // Only push if we're not already on /blog
      if (currentCategorySlug !== null) {
        router.push("/blog");
      }
    } else {
      // Get the first selected category's slug for URL
      const selectedCategory = categories.find((cat) => cat.documentId === categoryIds[0]);
      if (selectedCategory && currentCategorySlug !== selectedCategory.slug) {
        router.push(`/blog?category=${selectedCategory.slug}`);
      }
    }
  }, [router, categories, searchParams]);

  // Read category from URL on mount
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      // Find the category by slug
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategories([category.documentId]);
      }
    }
  }, [searchParams, categories]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      
      // Update URL after state change
      setTimeout(() => updateUrl(newSelection), 0);
      return newSelection;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    // Update URL after state change
    setTimeout(() => updateUrl([]), 0);
  };

  const filteredArticles = useMemo(() => {
    if (selectedCategories.length === 0) {
      return initialArticles;
    }

    return initialArticles.filter((article) => {
      // Support both single category and multiple categories
      const articleCategories = article.categories || (article.category ? [article.category] : []);
      return articleCategories.some((cat) =>
        selectedCategories.includes(cat.documentId)
      );
    });
  }, [initialArticles, selectedCategories]);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onClearFilters={handleClearFilters}
      />

      {filteredArticles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Aucun article trouvé pour cette sélection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            // Get all categories for the article
            const articleCategories = article.categories || (article.category ? [article.category] : []);

            return (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                excerpt={article.description}
                coverImage={article.cover?.url || ""}
                categories={articleCategories}
                publishedAt={article.publishedAt}
                blocks={article.blocks}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
