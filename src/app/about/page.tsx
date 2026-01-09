import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGeneralSettings, getPageBySlug, getAuthorInfo, decodeHtmlEntities } from "@/lib/wordpress";
import { Github, Linkedin, Mail, BookOpen, Code2, Layers, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  
  return {
    title: `À propos | ${settings?.title || 'Blog'}`,
    description: "Découvrez qui je suis, mon parcours et ma passion pour le développement web et les nouvelles technologies.",
  };
}

export default async function AboutPage() {
  // Récupération des données dynamiques depuis WordPress
  const [settings, aboutPage, authorInfo] = await Promise.all([
    getGeneralSettings(),
    getPageBySlug('a-propos'),
    getAuthorInfo(),
  ]);
  
  // Configuration du profil (fallback si pas de données WordPress)
  // Préférer l'avatar GitHub pour une meilleure qualité d'image
  const profileName = (authorInfo?.firstName && authorInfo.firstName.trim()) 
    ? authorInfo.firstName 
    : "Fabien";
  const profileUsername = "FabLrc";
  const avatarUrl = "https://github.com/FabLrc.png"; // Utiliser l'avatar GitHub par défaut
  
  // Liens sociaux (peuvent être configurés dans WordPress via les champs personnalisés)
  const socialLinks = {
    github: "https://github.com/FabLrc",
    linkedin: "https://linkedin.com/",
    twitter: "https://x.com/",
    email: "contact@example.com",
  };

  // Description décodée
  const siteDescription = settings?.description 
    ? decodeHtmlEntities(settings.description)
    : "Développeur full-stack basé à Paris - France, je partage mes découvertes et connaissances autour du développement d'applications et des nouvelles technologies.";

  const authorBio = authorInfo?.description 
    ? decodeHtmlEntities(authorInfo.description)
    : null;

  // Compétences techniques (peut être enrichi via WordPress)
  const skills = [
    { name: "React / Next.js", icon: Code2 },
    { name: "TypeScript", icon: Code2 },
    { name: "Node.js", icon: Layers },
    { name: "Python", icon: Code2 },
    { name: "WordPress / Headless CMS", icon: Layers },
    { name: "Shopify", icon: Layers },
    { name: "Docker", icon: Layers },
    { name: "CI/CD", icon: Sparkles },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Section principale - Profil */}
      <div className="text-center mb-12">
        <div className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
          <Image
            src={avatarUrl}
            alt={profileName}
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{profileName}</h1>
        <p className="text-muted-foreground text-lg mb-6">@{profileUsername}</p>
        
        {/* Liens sociaux */}
        <div className="flex justify-center gap-2 mb-8">
          {socialLinks.github && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks.linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <XIcon className="w-4 h-4" />
              </a>
            </Button>
          )}
          {socialLinks.email && (
            <Button variant="outline" size="icon" asChild>
              <a href={`mailto:${socialLinks.email}`} aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Bio - Contenu dynamique de WordPress */}
      <div className="prose prose-neutral dark:prose-invert mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Qui suis-je ?</h2>
        
        {/* Contenu de la page WordPress "À propos" si elle existe */}
        {aboutPage?.content ? (
          <div 
            className="text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutPage.content }} 
          />
        ) : (
          <>
            <p className="text-lg leading-relaxed">
              {siteDescription}
            </p>
            {authorBio && (
              <p className="text-lg leading-relaxed">
                {authorBio}
              </p>
            )}
            <p className="text-lg leading-relaxed">
              Je suis un développeur passionné par les technologies web modernes.
              J&apos;aime partager mes connaissances et mes découvertes à travers ce blog.
            </p>
          </>
        )}
      </div>

      {/* Compétences techniques */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Compétences techniques</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <Badge 
              key={skill.name} 
              variant="secondary" 
              className="text-sm py-2 px-4 flex items-center gap-2"
            >
              <skill.icon className="w-4 h-4" />
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Ce que vous trouverez sur ce blog */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Ce que vous trouverez ici</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tutoriels techniques</h3>
                  <p className="text-sm text-muted-foreground">
                    Des guides pratiques et détaillés sur les technologies web modernes, 
                    du frontend au backend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Intelligence Artificielle</h3>
                  <p className="text-sm text-muted-foreground">
                    Les dernières avancées en IA et comment les intégrer dans vos 
                    workflows de développement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">DevOps & Outils</h3>
                  <p className="text-sm text-muted-foreground">
                    Docker, CI/CD, GitHub Actions et tous les outils qui améliorent 
                    la productivité des développeurs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Retours d&apos;expérience</h3>
                  <p className="text-sm text-muted-foreground">
                    Mes découvertes, erreurs et apprentissages pour vous faire 
                    gagner du temps dans vos projets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-muted-foreground mb-6">
          Envie de découvrir mes articles ?
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/blog">
              <BookOpen className="w-4 h-4 mr-2" />
              Voir les articles
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Me contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
