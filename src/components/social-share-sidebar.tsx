"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Facebook, Link2, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

interface SocialShareSidebarProps {
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

export default function SocialShareSidebar({ title, url }: SocialShareSidebarProps) {
  const [copied, setCopied] = useState(false);

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
    <aside className="hidden xl:block">
      <div className="sticky top-24">
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
      </div>
    </aside>
  );
}
