import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API Route pour la revalidation on-demand
 * 
 * Cette route permet de forcer la régénération des pages statiques
 * immédiatement après la publication d'un nouvel article sur WordPress.
 * 
 * Configuration WordPress nécessaire :
 * 1. Installer un plugin webhook (ex: WP Webhooks, Advanced Post Notifier)
 * 2. Configurer un webhook POST vers : https://votre-domaine.com/api/revalidate
 * 3. Ajouter le secret dans les headers : x-revalidate-secret: VOTRE_SECRET
 * 4. Déclencher sur : publish_post, save_post
 * 
 * Variables d'environnement requises :
 * - REVALIDATE_SECRET_TOKEN : Token secret pour sécuriser l'endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le token de sécurité
    const secret = request.headers.get("x-revalidate-secret");
    
    if (!secret || secret !== process.env.REVALIDATE_SECRET_TOKEN) {
      console.log("[Revalidation] Token invalide ou manquant");
      return NextResponse.json(
        { message: "Token invalide ou manquant" },
        { status: 401 }
      );
    }

    // Récupérer le type d'événement et le slug de l'article si fourni
    const body = await request.json().catch(() => ({}));
    const { type, slug } = body;

    console.log("[Revalidation] Demande reçue:", { type, slug });

    // Revalider les pages concernées
    const pathsToRevalidate = [
      "/", // Page d'accueil (affiche les derniers articles)
      "/blog", // Page blog (liste tous les articles)
    ];

    // Si un slug est fourni, revalider aussi la page de l'article
    if (slug) {
      pathsToRevalidate.push(`/blog/${slug}`);
    }

    // Revalider toutes les pages concernées
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log("[Revalidation] Path revalidé:", path);
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Revalidation] Erreur:", error);
    return NextResponse.json(
      { 
        message: "Erreur lors de la revalidation",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint pour tester l'API (à désactiver en production)
 * Accès: https://votre-domaine.com/api/revalidate?secret=VOTRE_SECRET
 */
export async function GET(request: NextRequest) {
  // Cette route est utile pour tester, mais devrait être désactivée en production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { message: "Endpoint GET désactivé en production" },
      { status: 403 }
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");
  
  if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json(
      { message: "Token invalide" },
      { status: 401 }
    );
  }

  // Revalider les pages principales
  revalidatePath("/");
  revalidatePath("/blog");

  return NextResponse.json({
    revalidated: true,
    paths: ["/", "/blog"],
    timestamp: new Date().toISOString(),
    message: "Test de revalidation réussi",
  });
}
