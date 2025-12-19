"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extraire tous les H2 et H3 de l'article
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
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
    <Card className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-10rem)] overflow-auto">
      <CardHeader>
        <CardTitle className="text-sm">Table des matières</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-2 text-sm">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? "ml-4" : ""}
              >
                <Link
                  href={`#${heading.id}`}
                  className={`block hover:text-primary transition-colors ${
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
