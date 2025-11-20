import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Article introuvable</h2>
      <p className="text-muted-foreground mb-8">
        Désolé, l&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au blog
      </Link>
    </div>
  );
}
