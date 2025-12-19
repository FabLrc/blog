"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleTOC() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extraire tous les H2 et H3 du contenu de l'article uniquement
    const articleContent = document.querySelector("article .prose");
    if (!articleContent) return;

    const elements = articleContent.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((element, index) => {
      // Ignorer les titres qui sont à l'intérieur d'un blockquote
      if (element.closest("blockquote")) {
        return;
      }

      const id = element.id || `heading-${index}`;
      if (!element.id) {
        element.id = id;
      }

      items.push({
        id,
        text: element.textContent || "",
        level: parseInt(element.tagName.charAt(1)),
      });
    });

    setHeadings(items);

    // Observer pour mettre en surbrillance le titre actif
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-4 h-4" />
          Sommaire
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "ml-4" : ""}
              >
                <Link
                  href={`#${heading.id}`}
                  className={`block hover:text-primary transition-colors text-sm ${
                    activeId === heading.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
