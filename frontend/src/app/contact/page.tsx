"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileConfig } from "@/config/profile";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [decodedEmail, setDecodedEmail] = useState("");

  // Obfuscation de l'email (protection contre les bots)
  useEffect(() => {
    // Email encodé en base64 inversé
    const encoded = "moc.golbnom@tcatnoc";
    const email = encoded.split("").reverse().join("");
    setDecodedEmail(email);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulation d'envoi (à remplacer par un vrai endpoint API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus("success");
    
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    // Réinitialiser le statut après 3 secondes
    setTimeout(() => setSubmitStatus("idle"), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="À propos de..."
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre message..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200">
                    ✓ Merci ! J&apos;ai bien reçu votre message et je vous répondrai très bientôt 🎉
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
                    ✗ Oups, quelque chose s&apos;est mal passé... Pourriez-vous réessayer ? 🙏
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
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
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                {decodedEmail ? (
                  <a
                    href={`mailto:${decodedEmail}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {decodedEmail}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Chargement...</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Suivez-moi aussi sur</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <a href={profileConfig.social.x} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      X (Twitter)
                    </a>
                  </div>
                  <div>
                    <a href={profileConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      LinkedIn
                    </a>
                  </div>
                  <div>
                    <a href={profileConfig.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
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
