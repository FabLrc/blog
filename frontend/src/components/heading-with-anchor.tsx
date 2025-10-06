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

  return (
    <Tag id={id} className={cn("group relative scroll-mt-20", className)}>
      {children}
      <button
        onClick={handleCopyLink}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
        aria-label="Copier le lien vers cette section"
        title="Copier le lien"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </Tag>
  );
}
