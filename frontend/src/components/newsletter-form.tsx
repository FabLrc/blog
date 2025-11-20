"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { subscribeToNewsletter } from "@/lib/wordpress";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterFormProps {
  source?: string;
}

export default function NewsletterForm({ }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset status
    setStatus({ type: null, message: "" });
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({
        type: "error",
        message: "Veuillez entrer une adresse email valide.",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await subscribeToNewsletter(email);
      
      setStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      });

      if (result.success) {
        setEmail(""); // Clear the input on success
      }
    } catch {
      setStatus({
        type: "error",
        message: "Une erreur inattendue est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Restez informé
              </h3>
              <p className="text-sm text-muted-foreground">
                Inscrivez-vous à notre newsletter pour recevoir les derniers articles
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading} className="sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          {/* Status message */}
          {status.type && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                status.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Privacy note */}
          <p className="text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez de recevoir nos emails. 
            Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
