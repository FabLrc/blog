import ArticleCard from "@/components/article-card";
import { FeaturedArticle } from "@/components/featured-article";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getGeneralSettings } from "@/lib/wordpress";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { decodeHtmlEntities } from "@/lib/utils";

// Icône X (anciennement Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Enable ISR with 1 hour revalidation (fallback if webhook fails)
export const revalidate = 3600;

export default async function Home() {
  const [posts, settings] = await Promise.all([
    getAllPosts(4),
    getGeneralSettings(),
  ]);
  
  const [featuredPost, ...recentPosts] = posts;

  // Fallback values if settings are missing or incomplete
  // const siteTitle = settings?.title || "Mon Blog";
  const siteDescription = settings?.description || "Bienvenue sur mon blog";
  
  // Hardcoded profile info for now as it's not standard in WP General Settings
  // You might want to fetch this from a specific page or user in the future
  const profileName = "Fabien"; // Replace with dynamic data if available
  const profileBio = decodeHtmlEntities(siteDescription);
  const avatarUrl = "https://github.com/FabLrc.png"; // Fallback to GitHub avatar

  return (
    <div className="min-h-screen w-full">
      <WavyBackground className="w-full" containerClassName="h-auto py-12">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Profile Section */}
          <div className="text-center">
            <Avatar className="mx-auto mb-4 h-24 w-24">
              <AvatarImage src={avatarUrl} alt={profileName} />
              <AvatarFallback>
                {profileName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="mb-2 text-3xl font-bold">{profileName}</h1>
            
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              {profileBio}
            </p>

            <div className="flex justify-center gap-2">
              <Button variant="outline" size="icon" asChild title="GitHub">
                <a
                  href="https://github.com/FabLrc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild title="LinkedIn">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild title="X (Twitter)">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">X (Twitter)</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </WavyBackground>

      <div className="container mx-auto max-w-4xl px-4 pb-12">
        <Separator className="my-12" />

        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">À la une</h2>
            <FeaturedArticle post={featuredPost} />
          </section>
        )}

        {/* Recent Articles */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Articles récents</h2>
            <Button variant="ghost" asChild>
              <Link href="/blog">Voir tout</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                featuredImage={post.featuredImage?.node.sourceUrl}
                categories={post.categories}
                date={post.date}
                content={post.content} // Passed for reading time calculation
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
