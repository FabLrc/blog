import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteConfig } from "@/lib/strapi";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contactez-moi</h1>
        <p className="text-muted-foreground text-lg">
          Une question, une remarque ou juste envie de discuter ? N&apos;hésitez pas à m&apos;écrire, je serais ravi d&apos;échanger avec vous !
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulaire de contact */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Envoyez-moi un message
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et je vous répondrai dès que possible !
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Informations de contact */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Me contacter directement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteConfig.profileEmail && (
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href={`mailto:${siteConfig.profileEmail}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {siteConfig.profileEmail}
                  </a>
                </div>
              )}
              {(siteConfig.socialTwitter || siteConfig.socialLinkedin || siteConfig.socialGithub) && (
                <div>
                  <h3 className="font-semibold mb-1">Suivez-moi aussi sur</h3>
                  <div className="space-y-2 text-muted-foreground">
                    {siteConfig.socialTwitter && (
                      <div>
                        <a href={siteConfig.socialTwitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          X (Twitter)
                        </a>
                      </div>
                    )}
                    {siteConfig.socialLinkedin && (
                      <div>
                        <a href={siteConfig.socialLinkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {siteConfig.socialGithub && (
                      <div>
                        <a href={siteConfig.socialGithub} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          GitHub
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temps de réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Je réponds généralement sous 24-48h en semaine. Patience, je lis tous les messages avec attention ! ☕
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
