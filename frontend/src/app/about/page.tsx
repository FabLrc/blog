import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSiteConfig, getStrapiImageUrl } from "@/lib/strapi";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default async function AboutPage() {
  const siteConfig = await getSiteConfig();
  
  // Get avatar URL from Strapi or fallback to GitHub
  const avatarUrl = siteConfig.profileAvatar
    ? getStrapiImageUrl(siteConfig.profileAvatar.url)
    : `https://github.com/${siteConfig.profileUsername}.png`;
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Section principale */}
      <div className="text-center mb-12">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10">
          <Image
            src={avatarUrl}
            alt={siteConfig.profileName}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{siteConfig.profileName}</h1>
        <p className="text-muted-foreground text-lg mb-6">@{siteConfig.profileUsername}</p>
        
        {/* Liens sociaux */}
        <div className="flex justify-center gap-2 mb-8">
          {siteConfig.socialGithub && (
            <Button variant="outline" size="icon" asChild>
              <a href={siteConfig.socialGithub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
          {siteConfig.socialLinkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={siteConfig.socialLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {siteConfig.socialTwitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={siteConfig.socialTwitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <XIcon className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-12" />

      {/* Biographie */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
          {siteConfig.profileBio}
        </p>
      </div>

      {/* Email de contact si disponible */}
      {siteConfig.profileEmail && (
        <>
          <Separator className="mb-12" />
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Email : <a href={`mailto:${siteConfig.profileEmail}`} className="text-primary hover:underline">{siteConfig.profileEmail}</a>
            </p>
          </div>
        </>
      )}

      <Separator className="mb-12" />

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Envie d&apos;échanger ou de collaborer ?
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="default">
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Me contacter
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">
              Lire mes articles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
