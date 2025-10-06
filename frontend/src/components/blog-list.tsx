"use client";

import { useState, useMemo } from "react";
import { StrapiArticle, StrapiCategory } from "@/types/strapi";
import { CategoryFilter } from "./category-filter";
import ArticleCard from "./article-card";

interface BlogListProps {
  initialArticles: StrapiArticle[];
  categories: StrapiCategory[];
}

export function BlogList({ initialArticles, categories }: BlogListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
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
              />
            );
          })}
        </div>
      )}
    </>
  );
}
