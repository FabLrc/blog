"use client";

import { Button } from "@/components/ui/button";
import { Check, Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
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
        
        {/* Twitter */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
        >
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Twitter"
          >
            <Twitter className="w-4 h-4" />
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
