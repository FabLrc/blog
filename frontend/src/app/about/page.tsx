import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getGeneralSettings } from "@/lib/wordpress";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default async function AboutPage() {
  const settings = await getGeneralSettings();
  
  // Hardcoded profile info (replace with dynamic data if available)
  const profileName = "Fabien";
  const profileUsername = "FabLrc";
  const avatarUrl = "https://github.com/FabLrc.png";
  const socialGithub = "https://github.com/FabLrc";
  const socialLinkedin = "https://linkedin.com";
  const socialEmail = "contact@example.com";

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Section principale */}
      <div className="text-center mb-12">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10">
          <Image
            src={avatarUrl}
            alt={profileName}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{profileName}</h1>
        <p className="text-muted-foreground text-lg mb-6">@{profileUsername}</p>
        
        {/* Liens sociaux */}
        <div className="flex justify-center gap-2 mb-8">
          {socialGithub && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialGithub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" asChild>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <XIcon className="w-4 h-4" />
            </a>
          </Button>
          {socialEmail && (
            <Button variant="outline" size="icon" asChild>
              <a href={`mailto:${socialEmail}`} aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Bio */}
      <div className="prose prose-neutral dark:prose-invert mx-auto">
        <p>
          {settings?.description || "Bienvenue sur mon blog personnel."}
        </p>
        <p>
          Je suis un développeur passionné par les technologies web modernes.
          J&apos;aime partager mes connaissances et mes découvertes à travers ce blog.
        </p>
      </div>
    </div>
  );
}
