"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { extractTextFromBlocks, searchArticles } from "@/lib/strapi";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils";
import { StrapiArticle } from "@/types/strapi";
import { Command } from "cmdk";
import { Calendar, Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StrapiArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true);
        const articles = await searchArticles(query);
        setResults(articles);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery("");
    setResults([]);
    router.push(`/blog/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <VisuallyHidden.Root>
          <DialogTitle>Recherche d&apos;articles</DialogTitle>
        </VisuallyHidden.Root>
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Rechercher des articles..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Recherche en cours...
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Aucun article trouvé pour &ldquo;{query}&rdquo;
              </div>
            )}

            {!loading && query === "" && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Tapez pour rechercher des articles
              </div>
            )}

            {!loading && results.length > 0 && (
              <Command.Group heading="Articles">
                {results.map((article) => {
                  const articleText = extractTextFromBlocks(article.blocks || []);
                  const readingMinutes = calculateReadingTime(articleText);
                  const readingTime = formatReadingTime(readingMinutes);
                  const publishedDate = new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <Command.Item
                      key={article.id}
                      value={article.slug}
                      onSelect={() => handleSelect(article.slug)}
                      className="group flex cursor-pointer flex-col gap-2 rounded-md px-3 py-3 hover:bg-accent aria-selected:bg-accent"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">
                            {article.title}
                          </div>
                          {article.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {article.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{publishedDate}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{readingTime}</span>
                        </div>
                        {article.categories && article.categories.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-primary">{article.categories[0].name}</span>
                          </>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>

          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Navigation avec ↑ ↓</span>
              <span>Entrer pour sélectionner</span>
              <span>Échap pour fermer</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
