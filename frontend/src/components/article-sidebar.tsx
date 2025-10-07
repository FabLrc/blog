"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Facebook, Link2, Linkedin, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleSidebarProps {
  title: string;
  url: string;
}

// Custom X (Twitter) Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ArticleSidebar({ title, url }: ArticleSidebarProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Extraire tous les H2 et H3 de l'article
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((element, index) => {
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = {
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed on the right side */}
      <aside className="hidden 2xl:block fixed right-8 top-32 w-64 space-y-4">
        <div className="sticky top-32 max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 pr-2">
          {/* Social Share */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Partager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href={shareLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity text-sm"
                aria-label="Partager sur X"
              >
                <XIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">X</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#0A66C2] text-white hover:opacity-80 transition-opacity text-sm"
                aria-label="Partager sur LinkedIn"
              >
                <Linkedin className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">LinkedIn</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1877F2] text-white hover:opacity-80 transition-opacity text-sm"
                aria-label="Partager sur Facebook"
              >
                <Facebook className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Facebook</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-left text-sm"
                aria-label="Copier le lien"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
                    <span className="font-medium text-green-600">Copié !</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Copier</span>
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          {headings.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sommaire</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <nav className="max-h-[calc(100vh-32rem)] overflow-y-auto pr-2">
                  <ul className="space-y-2 text-sm">
                    {headings.map((heading) => (
                      <li
                        key={heading.id}
                        className={heading.level === 3 ? "ml-4" : ""}
                      >
                        <Link
                          href={`#${heading.id}`}
                          className={`block hover:text-primary transition-colors line-clamp-2 ${
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
          )}
        </div>
      </aside>

      {/* Mobile/Tablet Sticky Bar - Horizontal layout at top */}
      <div className="block 2xl:hidden sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            {/* Share buttons - Compact horizontal */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                Partager :
              </span>
              <div className="flex gap-1.5">
                <a
                  href={shareLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
                  aria-label="Partager sur X"
                >
                  <XIcon className="w-4 h-4" />
                </a>

                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Partager sur LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Partager sur Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Copier le lien"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* TOC Dropdown for mobile */}
            {headings.length > 0 && (
              <details className="relative group">
                <summary className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 cursor-pointer text-sm font-medium list-none">
                  Sommaire
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-lg border bg-card shadow-lg p-4">
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
                              const details = e.currentTarget.closest('details');
                              if (details) details.open = false;
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
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
