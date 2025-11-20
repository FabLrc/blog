"use client";

import { Check, Facebook, Link2, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

interface SocialShareMobileProps {
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

export default function SocialShareMobile({ title, url }: SocialShareMobileProps) {
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
    <div className="xl:hidden mb-6 flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Partager :</span>
      </div>
      
      <div className="flex gap-2 flex-1">
        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity text-sm flex-1 sm:flex-initial"
          aria-label="Partager sur X"
        >
          <XIcon className="w-4 h-4 sm:mr-2" />
          <span className="font-medium hidden sm:inline">X</span>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 rounded-md bg-[#0A66C2] text-white hover:opacity-80 transition-opacity text-sm flex-1 sm:flex-initial"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin className="w-4 h-4 sm:mr-2" />
          <span className="font-medium hidden sm:inline">LinkedIn</span>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 rounded-md bg-[#1877F2] text-white hover:opacity-80 transition-opacity text-sm flex-1 sm:flex-initial"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="w-4 h-4 sm:mr-2" />
          <span className="font-medium hidden sm:inline">Facebook</span>
        </a>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm flex-1 sm:flex-initial"
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
  );
}
