"use client";

import { Button } from "@/components/ui/button";
import { Check, Facebook, Link2, Linkedin } from "lucide-react";
import { useState } from "react";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col gap-3">
        <div className="text-xs text-muted-foreground mb-2 text-center">
          Partager
        </div>
        
        {/* X (Twitter) */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white transition-colors"
        >
          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur X"
          >
            <XIcon className="w-4 h-4" />
          </a>
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
        >
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </Button>

        {/* Facebook */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
        >
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
        </Button>

        {/* Copier le lien */}
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Copier le lien"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
