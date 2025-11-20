import NewsletterForm from "@/components/newsletter-form";
import { Separator } from "@/components/ui/separator";
import { GeneralSettings } from "@/types/wordpress";
import { Rss } from "lucide-react";
import Link from "next/link";

// Fonction pour décoder les entités HTML
function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Côté serveur : utiliser replace pour les entités communes
    return text
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  // Côté client : utiliser DOMParser (plus fiable)
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

interface FooterProps {
  siteConfig: GeneralSettings | null;
}

export default function Footer({ siteConfig }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
    { href: "/rss.xml", label: "RSS", external: true },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <NewsletterForm source="footer" />
        </div>

        <Separator className="mb-8" />

        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
              {siteConfig?.title || "Mon Blog"}
            </Link>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {siteConfig?.description ? decodeHtmlEntities(siteConfig.description) : "Blog personnel"}
            </p>
          </div>


          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {link.label === "RSS" && <Rss className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>© {currentYear} {siteConfig?.title || "Mon Blog"}</p>
            <p className="mt-1">Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
