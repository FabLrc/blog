"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${item.href}` }),
    })),
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumb */}
      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      >
        {/* Home icon */}
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
          aria-label="Accueil"
        >
          <Home className="h-4 w-4" />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`truncate ${isLast ? "font-medium text-foreground" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
