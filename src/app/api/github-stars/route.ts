import { NextRequest, NextResponse } from 'next/server';

// Cache des étoiles (en mémoire) - valide pendant 1 heure
const cache = new Map<string, { stars: number; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repo = searchParams.get('repo');

  if (!repo) {
    return NextResponse.json({ error: 'Repository parameter is required' }, { status: 400 });
  }

  // Vérifier le cache
  const cached = cache.get(repo);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ stars: cached.stars }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Next.js Blog',
    };

    // Ajouter le token GitHub s'il est disponible (améliore la limite de rate)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 }, // Revalider toutes les heures
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    const stars = data.stargazers_count || 0;

    // Mettre à jour le cache
    cache.set(repo, { stars, timestamp: Date.now() });

    return NextResponse.json({ stars }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    
    // Retourner les données du cache même si expirées en cas d'erreur
    if (cached) {
      return NextResponse.json({ stars: cached.stars });
    }

    return NextResponse.json({ error: 'Failed to fetch stars' }, { status: 500 });
  }
}
