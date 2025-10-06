"use client";

import { Badge } from "@/components/ui/badge";
import { StrapiCategory } from "@/types/strapi";
import { X } from "lucide-react";

interface CategoryFilterProps {
  categories: StrapiCategory[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearFilters: () => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
}: CategoryFilterProps) {
  const activeCount = selectedCategories.length;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filtrer par catégorie :
        </span>
        
        <Badge
          variant={activeCount === 0 ? "default" : "outline"}
          className="cursor-pointer transition-all hover:shadow-md"
          onClick={onClearFilters}
        >
          Toutes {activeCount > 0 && `(${activeCount} filtre${activeCount > 1 ? 's' : ''})`}
        </Badge>

        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.documentId);
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => onCategoryToggle(category.documentId)}
            >
              {category.name}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
      
      {activeCount > 0 && (
        <div className="mt-3 text-sm text-muted-foreground">
          {activeCount} catégorie{activeCount > 1 ? 's' : ''} sélectionnée{activeCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
