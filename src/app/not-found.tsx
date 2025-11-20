import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page introuvable</h2>
      <p className="text-muted-foreground mb-8">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button asChild variant="default">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voir le blog
          </Link>
        </Button>
      </div>
    </div>
  );
}
