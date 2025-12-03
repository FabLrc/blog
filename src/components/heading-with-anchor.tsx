"use client";

import { cn } from "@/lib/utils";
import { Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

interface HeadingWithAnchorProps {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function HeadingWithAnchor({ id, level, children, className }: HeadingWithAnchorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // Size and style classes based on heading level
  const levelStyles = {
    1: "text-[2.5rem] md:text-[3rem] font-extrabold tracking-tight leading-tight",
    2: "text-[2rem] md:text-[2.25rem] font-bold tracking-tight leading-snug pb-2 border-b-2 border-border",
    3: "text-[1.5rem] md:text-[1.75rem] font-semibold tracking-tight leading-snug",
    4: "text-[1.25rem] md:text-[1.375rem] font-semibold leading-normal",
    5: "text-[1.125rem] font-semibold leading-normal",
    6: "text-base font-semibold uppercase tracking-wide text-muted-foreground",
  };

  return (
    <Tag id={id} className={cn("group relative scroll-mt-24", levelStyles[level], className)}>
      {children}
      <button
        onClick={handleCopyLink}
        className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-accent"
        aria-label="Copier le lien vers cette section"
        title="Copier le lien"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <LinkIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </Tag>
  );
}
